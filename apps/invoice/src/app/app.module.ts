import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { InvoiceModule } from './modules/invoice/invoice.module';
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
        InvoiceModule,
    ],
})
export class AppModule {
    static CONFIGURATION: TConfiguration = CONFIGURATION;
}
