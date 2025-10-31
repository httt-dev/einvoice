import { Controller, UseInterceptors } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
    async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
        const result = await this.invoiceService.create(params);

        return Response.success<InvoiceTcpResponse>(result);
    }

    @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
    async sendById(
        @RequestParams() params: SendInvoiceTcpReq,
        @ProcessId() processId: string,
    ): Promise<Response<string>> {
        const result = await this.invoiceService.sendById(params, processId);
        return Response.success<string>(result);
    }
}
