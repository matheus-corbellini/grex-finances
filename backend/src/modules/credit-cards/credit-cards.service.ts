import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { CreditCard } from "./entities/credit-card.entity";
import { Transaction, TransactionStatus } from "../transactions/entities/transaction.entity";
import {
    CreateCreditCardDto,
    UpdateCreditCardDto,
    CreditCardResponseDto,
    CreditCardStatsDto
} from "./dto/credit-card.dto";
import { CreditCardBrand, CreditCardStatus } from "./entities/credit-card.entity";

@Injectable()
export class CreditCardsService {
    private readonly logger = new Logger(CreditCardsService.name);

    constructor(
        @InjectRepository(CreditCard)
        private creditCardRepository: Repository<CreditCard>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    // ===== CRUD METHODS =====

    async create(userId: string, createDto: CreateCreditCardDto): Promise<CreditCardResponseDto> {
        try {
            // Verificar se cartão já existe (mesmo nome e últimos 4 dígitos)
            const existingCard = await this.creditCardRepository.findOne({
                where: {
                    userId,
                    name: createDto.name,
                    lastFourDigits: createDto.lastFourDigits,
                    isActive: true
                }
            });

            if (existingCard) {
                throw new ConflictException("Cartão já existe");
            }

            // Se for o primeiro cartão ou marcado como padrão, definir como padrão
            const existingCardsCount = await this.creditCardRepository.count({
                where: { userId, isActive: true }
            });

            const isDefault = createDto.isDefault || existingCardsCount === 0;

            // Se marcado como padrão, remover padrão dos outros cartões
            if (isDefault) {
                await this.creditCardRepository.update(
                    { userId, isActive: true },
                    { isDefault: false }
                );
            }

            const creditCard = this.creditCardRepository.create({
                ...createDto,
                userId,
                isDefault,
                availableLimit: createDto.creditLimit,
                currentBalance: 0
            });

            const savedCard = await this.creditCardRepository.save(creditCard);

            this.logger.log(`Cartão de crédito criado: ${savedCard.id} - ${savedCard.name}`);

            return this.mapCreditCardToResponse(savedCard);
        } catch (error) {
            this.logger.error(`Erro ao criar cartão de crédito:`, error);
            throw error;
        }
    }

    async findAll(userId: string, status?: CreditCardStatus, brand?: CreditCardBrand): Promise<CreditCardResponseDto[]> {
        try {
            const queryBuilder = this.creditCardRepository
                .createQueryBuilder('creditCard')
                .where('creditCard.userId = :userId', { userId })
                .andWhere('creditCard.isActive = :isActive', { isActive: true })
                .orderBy('creditCard.isDefault', 'DESC')
                .addOrderBy('creditCard.name', 'ASC');

            if (status) {
                queryBuilder.andWhere('creditCard.status = :status', { status });
            }

            if (brand) {
                queryBuilder.andWhere('creditCard.brand = :brand', { brand });
            }

            const creditCards = await queryBuilder.getMany();

            return creditCards.map(card => this.mapCreditCardToResponse(card));
        } catch (error) {
            this.logger.error(`Erro ao buscar cartões de crédito:`, error);
            throw error;
        }
    }

    async findOne(userId: string, id: string): Promise<CreditCardResponseDto> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            return this.mapCreditCardToResponse(creditCard);
        } catch (error) {
            this.logger.error(`Erro ao buscar cartão de crédito ${id}:`, error);
            throw error;
        }
    }

    async update(userId: string, id: string, updateDto: UpdateCreditCardDto): Promise<CreditCardResponseDto> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            // Se marcado como padrão, remover padrão dos outros cartões
            if (updateDto.isDefault) {
                await this.creditCardRepository.update(
                    { userId, isActive: true },
                    { isDefault: false }
                );
            }

            // Atualizar limite disponível se o limite de crédito mudou
            if (updateDto.creditLimit !== undefined) {
                const newAvailableLimit = updateDto.creditLimit - creditCard.currentBalance;
                updateDto = { ...updateDto, availableLimit: Math.max(0, newAvailableLimit) };
            }

            Object.assign(creditCard, updateDto);
            const savedCard = await this.creditCardRepository.save(creditCard);

            this.logger.log(`Cartão de crédito atualizado: ${savedCard.id}`);

            return this.mapCreditCardToResponse(savedCard);
        } catch (error) {
            this.logger.error(`Erro ao atualizar cartão de crédito ${id}:`, error);
            throw error;
        }
    }

    async remove(userId: string, id: string): Promise<void> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            // Verificar se há transações pendentes
            const pendingTransactions = await this.transactionRepository.count({
                where: {
                    creditCardId: id,
                    status: TransactionStatus.PENDING
                }
            });

            if (pendingTransactions > 0) {
                throw new BadRequestException("Não é possível remover cartão com transações pendentes");
            }

            // Soft delete
            creditCard.isActive = false;
            await this.creditCardRepository.save(creditCard);

            this.logger.log(`Cartão de crédito removido (soft delete): ${creditCard.id}`);
        } catch (error) {
            this.logger.error(`Erro ao remover cartão de crédito ${id}:`, error);
            throw error;
        }
    }

    // ===== TRANSACTION METHODS =====

    async addTransaction(userId: string, cardId: string, amount: number, description?: string): Promise<void> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id: cardId, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            // Verificar se há limite disponível
            if (amount > creditCard.availableLimit) {
                throw new BadRequestException("Valor excede o limite disponível");
            }

            // Atualizar saldo e limite disponível
            creditCard.currentBalance += amount;
            creditCard.availableLimit -= amount;

            await this.creditCardRepository.save(creditCard);

            this.logger.log(`Transação adicionada ao cartão ${cardId}: R$ ${amount}`);
        } catch (error) {
            this.logger.error(`Erro ao adicionar transação ao cartão ${cardId}:`, error);
            throw error;
        }
    }

    async payBill(userId: string, cardId: string, amount: number): Promise<void> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id: cardId, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            if (amount > creditCard.currentBalance) {
                throw new BadRequestException("Valor de pagamento excede o saldo atual");
            }

            // Atualizar saldo e limite disponível
            creditCard.currentBalance -= amount;
            creditCard.availableLimit += amount;

            await this.creditCardRepository.save(creditCard);

            this.logger.log(`Pagamento realizado no cartão ${cardId}: R$ ${amount}`);
        } catch (error) {
            this.logger.error(`Erro ao realizar pagamento no cartão ${cardId}:`, error);
            throw error;
        }
    }

    // ===== STATISTICS =====

    async getStats(userId: string): Promise<CreditCardStatsDto> {
        try {
            const creditCards = await this.creditCardRepository.find({
                where: { userId, isActive: true }
            });

            const totalCards = creditCards.length;
            const activeCards = creditCards.filter(card => card.status === CreditCardStatus.ACTIVE).length;

            const totalCreditLimit = creditCards.reduce((sum, card) => sum + Number(card.creditLimit), 0);
            const totalAvailableLimit = creditCards.reduce((sum, card) => sum + Number(card.availableLimit), 0);
            const totalCurrentBalance = creditCards.reduce((sum, card) => sum + Number(card.currentBalance), 0);

            const utilizationRate = totalCreditLimit > 0 ? (totalCurrentBalance / totalCreditLimit) * 100 : 0;

            const averageInterestRate = creditCards.length > 0
                ? creditCards.reduce((sum, card) => sum + Number(card.interestRate), 0) / creditCards.length
                : 0;

            const totalAnnualFees = creditCards.reduce((sum, card) => sum + Number(card.annualFee), 0);

            // Contar cartões por bandeira
            const cardsByBrand = Object.values(CreditCardBrand).reduce((acc, brand) => {
                acc[brand] = creditCards.filter(card => card.brand === brand).length;
                return acc;
            }, {} as Record<CreditCardBrand, number>);

            // Próximos vencimentos
            const upcomingPayments = creditCards
                .filter(card => card.dueDate && card.currentBalance > 0)
                .map(card => {
                    const dueDate = new Date(card.dueDate);
                    const today = new Date();
                    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    return {
                        cardId: card.id,
                        cardName: card.name,
                        dueDate: dueDate,
                        amount: Number(card.currentBalance),
                        daysUntilDue: daysUntilDue
                    };
                })
                .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
                .slice(0, 5); // Próximos 5 vencimentos

            return {
                totalCards,
                activeCards,
                totalCreditLimit,
                totalAvailableLimit,
                totalCurrentBalance,
                utilizationRate,
                averageInterestRate,
                totalAnnualFees,
                cardsByBrand,
                upcomingPayments
            };
        } catch (error) {
            this.logger.error(`Erro ao buscar estatísticas de cartões:`, error);
            throw error;
        }
    }

    // ===== UTILITY METHODS =====

    async setDefaultCard(userId: string, cardId: string): Promise<void> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id: cardId, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            // Remover padrão de todos os cartões
            await this.creditCardRepository.update(
                { userId, isActive: true },
                { isDefault: false }
            );

            // Definir como padrão
            creditCard.isDefault = true;
            await this.creditCardRepository.save(creditCard);

            this.logger.log(`Cartão ${cardId} definido como padrão para usuário ${userId}`);
        } catch (error) {
            this.logger.error(`Erro ao definir cartão padrão:`, error);
            throw error;
        }
    }

    async updateLimits(userId: string, cardId: string, newCreditLimit: number): Promise<void> {
        try {
            const creditCard = await this.creditCardRepository.findOne({
                where: { id: cardId, userId, isActive: true }
            });

            if (!creditCard) {
                throw new NotFoundException("Cartão de crédito não encontrado");
            }

            creditCard.creditLimit = newCreditLimit;
            creditCard.availableLimit = newCreditLimit - Number(creditCard.currentBalance);

            await this.creditCardRepository.save(creditCard);

            this.logger.log(`Limites atualizados para cartão ${cardId}: R$ ${newCreditLimit}`);
        } catch (error) {
            this.logger.error(`Erro ao atualizar limites do cartão ${cardId}:`, error);
            throw error;
        }
    }

    async getCardsNearLimit(userId: string, threshold: number = 80): Promise<CreditCardResponseDto[]> {
        try {
            const creditCards = await this.creditCardRepository.find({
                where: { userId, isActive: true, status: CreditCardStatus.ACTIVE }
            });

            const cardsNearLimit = creditCards.filter(card => {
                const utilizationRate = (Number(card.currentBalance) / Number(card.creditLimit)) * 100;
                return utilizationRate >= threshold;
            });

            return cardsNearLimit.map(card => this.mapCreditCardToResponse(card));
        } catch (error) {
            this.logger.error(`Erro ao buscar cartões próximos do limite:`, error);
            throw error;
        }
    }

    private mapCreditCardToResponse(creditCard: CreditCard): CreditCardResponseDto {
        return {
            id: creditCard.id,
            name: creditCard.name,
            description: creditCard.description,
            brand: creditCard.brand,
            lastFourDigits: creditCard.lastFourDigits,
            holderName: creditCard.holderName,
            creditLimit: Number(creditCard.creditLimit),
            availableLimit: Number(creditCard.availableLimit),
            currentBalance: Number(creditCard.currentBalance),
            interestRate: Number(creditCard.interestRate),
            annualFee: Number(creditCard.annualFee),
            expirationDate: creditCard.expirationDate,
            closingDate: creditCard.closingDate,
            dueDate: creditCard.dueDate,
            status: creditCard.status,
            isActive: creditCard.isActive,
            isDefault: creditCard.isDefault,
            externalId: creditCard.externalId,
            metadata: creditCard.metadata,
            createdAt: creditCard.createdAt,
            updatedAt: creditCard.updatedAt
        };
    }
}
