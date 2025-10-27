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
            host: AppModule.CONFIGURATION.TCP_SERV.TCP_AUTHORIZER_SERVICE.options.host,
            port: AppModule.CONFIGURATION.TCP_SERV.TCP_AUTHORIZER_SERVICE.options.port,
        },
    });

    Logger.debug('grpc config', AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.name,
            protoPath: AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.options.protoPath,
            url: AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.options.url,
        },
    });

    // Start all microservices
    await app.startAllMicroservices();

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.AUTHORIZER_PORT || 3000;
    await app.listen(port);
    Logger.log(`Authoizer application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
