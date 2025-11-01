import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ObjectId } from 'mongodb';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';

@Injectable()
export class InvoiceService {
    constructor(
        private readonly invoiceRepository: InvoiceRepository,
        @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
        @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
    ) {}

    create(params: CreateInvoiceTcpRequest) {
        const input = invoiceRequestMapping(params);
        return this.invoiceRepository.create(input);
    }

    async sendById(params: SendInvoiceTcpReq, processId: string) {
        const { invoiceId, userId } = params;

        const invoice = await this.invoiceRepository.getById(invoiceId);
        if (invoice.status !== INVOICE_STATUS.CREATED) {
            throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SENT);
        }

        const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);

        // upload
        const fileName = `invoice-${invoiceId}`;

        const fileUrl = await this.uploadFile({ fileBase64: pdfBase64, fileName: fileName }, processId);
        Logger.debug('sendById', fileName, fileUrl);

        // update db
        await this.invoiceRepository.updateById(invoiceId, {
            status: INVOICE_STATUS.SENT,
            supervisorId: new ObjectId(userId),
            fileUrl: fileUrl,
        });
        return fileUrl;
    }

    generatorInvoicePdf(data: Invoice, processId: string) {
        return firstValueFrom(
            this.pdfGeneratorClient
                .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
                    data,
                    processId,
                })
                .pipe(map((data) => data.data)),
        );
    }

    uploadFile(data: UploadFileTcpReq, processId: string) {
        // return file url
        return firstValueFrom(
            // message se duoc consume tai media service
            this.mediaClient
                .send<string, UploadFileTcpReq>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
                    data,
                    processId,
                })
                .pipe(map((data) => data.data)),
        );
    }
}
