import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';

import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductModule } from './modules/product/product.module';

function configFactory() {
    return CONFIGURATION;
}
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [configFactory] }),
        // Register TCP Client to communicate with Invoice Microservice
        InvoiceModule,
        ProductModule,
    ],
    controllers: [],
    providers: [{ provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor }],
})
export class AppModule {
    static CONFIGURATION: TConfiguration = CONFIGURATION;

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
