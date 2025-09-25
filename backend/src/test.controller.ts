import { Controller, Get } from '@nestjs/common';

@Controller('test-endpoint')
export class TestController {
    @Get()
    test() {
        return { message: 'Test endpoint funcionando!' };
    }
}
