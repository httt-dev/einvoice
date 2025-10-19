/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Connect to Invoice Microservice ( invoice-microservice : consummer)
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: AppModule.CONFIGURATION.TCP_SERV.TCP_USER_ACCESS_SERVICE.options.host,
            port: AppModule.CONFIGURATION.TCP_SERV.TCP_USER_ACCESS_SERVICE.options.port,
        },
    });
    // Start all microservices
    await app.startAllMicroservices();

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.USER_ACCESS_PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀User application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
