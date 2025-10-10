import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
    @Get()
    @ApiOperation({ summary: 'Teste público sem autenticação' })
    @ApiResponse({ status: 200, description: 'Teste funcionando' })
    async test() {
        return {
            message: 'Teste público funcionando!',
            timestamp: new Date().toISOString(),
            status: 'OK'
        };
    }

    @Get('accounts')
    @ApiOperation({ summary: 'Teste de contas sem autenticação' })
    @ApiResponse({ status: 200, description: 'Contas de teste' })
    async testAccounts() {
        return {
            accounts: [
                {
                    id: 'test-1',
                    name: 'Conta Teste 1',
                    balance: 1000.00,
                    type: 'checking'
                },
                {
                    id: 'test-2',
                    name: 'Conta Teste 2',
                    balance: 2500.00,
                    type: 'savings'
                }
            ],
            total: 2
        };
    }
}