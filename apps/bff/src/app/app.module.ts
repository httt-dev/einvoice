import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { ClientsModule, Transport } from '@nestjs/microservices';

function configFactory() {
    return CONFIGURATION;
}
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [configFactory] }),
        // Register TCP Client to communicate with Invoice Microservice
        ClientsModule.register([
            { name: 'TCP_INVOICE_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3301 } },
        ]),
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
