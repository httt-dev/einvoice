import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Request } from '@common/interfaces/tcp/common/request.interfcae';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getData() {
        return this.appService.getData();
    }

    @MessagePattern('get_invoice')
    getInvoice(data: Request<number>): Response<string> {
        const invoiceId = data.data;
        return Response.success<string>(`Invoice Data for id: ${invoiceId}`);
    }
}
