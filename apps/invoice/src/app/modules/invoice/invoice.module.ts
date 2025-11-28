import { MongoProvider } from '@common/configuration/mongo.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { PaymentModule } from '../payment/payment.module';
import { KafkaModule } from '@common/kafka/kafka.module';
import { QUEUE_SERVICES } from '@common/constants/enum/queue.enum';

@Module({
    imports: [
        MongoProvider,
        MongooseModule.forFeature([InvoiceDestination]),
        ClientsModule.registerAsync([
            TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE),
            TcpProvider(TCP_SERVICES.MEDIA_SERVICE),
        ]), // dang ky de co the goi TCP server khac
        PaymentModule, // de co the goi service cua payment module
        // ClientsModule.register([
        //     {
        //         name: 'INVOICE_SERVICE',
        //         transport: Transport.KAFKA,
        //         options: {
        //             client: {
        //                 clientId: 'invoice-clientId',
        //                 brokers: ['localhost:29092'],
        //             },
        //         },
        //     },
        // ]),

        KafkaModule.register(QUEUE_SERVICES.INVOICE),
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
