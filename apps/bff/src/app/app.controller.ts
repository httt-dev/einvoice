import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { map } from 'rxjs/operators';
@Controller('app')
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
    ) {}

    @Get()
    getData() {
        const result = this.appService.getData();

        throw new BadRequestException('Invalid request example');
        return new ResponseDto({ data: result });
    }

    @Get('invoice')
    async getInvoice() {
        return this.invoiceClient
            .send<string, number>('get_invoice', { processId: '123', data: 42 })
            .pipe(map((data) => new ResponseDto<string>(data)));
    }
}
