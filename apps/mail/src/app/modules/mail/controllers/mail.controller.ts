import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';
import { MailInvoiceService } from '../services/mail-invoice.service';

@Controller()
export class MailController {
    constructor(private readonly mailInvoceService: MailInvoiceService) {}

    @EventPattern('invoice-sent')
    async invoiceSentEvent(@Payload() payload: InvoiceSentPayload, @Ctx() context: KafkaContext) {
        Logger.debug({
            payload,
            context,
        });
        await this.mailInvoceService.sendInvoice(payload);
    }
}
