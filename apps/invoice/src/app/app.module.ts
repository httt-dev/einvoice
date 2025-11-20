import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
        InvoiceModule,
        PaymentModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {
    static CONFIGURATION: TConfiguration = CONFIGURATION;
}
