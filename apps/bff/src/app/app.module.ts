import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';

function configFactory() {
    return CONFIGURATION;
}
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [configFactory] }),
        // Register TCP Client to communicate with Invoice Microservice
        ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)]),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor }],
})
export class AppModule {
    static CONFIGURATION: TConfiguration = CONFIGURATION;

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
