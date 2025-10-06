import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Transaction } from "../../transactions/entities/transaction.entity";

export enum CreditCardBrand {
    VISA = "visa",
    MASTERCARD = "mastercard",
    AMERICAN_EXPRESS = "american_express",
    ELO = "elo",
    HIPERCARD = "hipercard",
    DINERS = "diners",
    DISCOVER = "discover",
    JCB = "jcb",
    OTHER = "other"
}

export enum CreditCardStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BLOCKED = "blocked",
    EXPIRED = "expired"
}

@Entity("credit_cards")
export class CreditCard {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    brand: CreditCardBrand;

    @Column({ length: 4 })
    lastFourDigits: string;

    @Column({ nullable: true })
    holderName: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    creditLimit: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    availableLimit: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    currentBalance: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    interestRate: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    annualFee: number;

    @Column({ type: "date", nullable: true })
    expirationDate: Date;

    @Column({ type: "date", nullable: true })
    closingDate: Date;

    @Column({ type: "date", nullable: true })
    dueDate: Date;

    @Column({ type: "enum", enum: CreditCardStatus, default: CreditCardStatus.ACTIVE })
    status: CreditCardStatus;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isDefault: boolean;

    @Column({ nullable: true })
    externalId: string; // Para integração com sistemas externos

    @Column("simple-json", { nullable: true })
    metadata: {
        bankName?: string;
        accountNumber?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        notes?: string;
    };

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(() => Transaction, transaction => transaction.creditCard)
    transactions: Transaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
