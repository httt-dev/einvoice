/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule, {
            rawBody: true,
        });
        const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;

        app.setGlobalPrefix(globalPrefix);
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        // cors
        app.enableCors({ origin: '*' });
        //swagger setup
        const config = new DocumentBuilder()
            .setTitle('Einvoice BFF API')
            .setDescription('The BFF API description')
            .setVersion('1.0.0')
            .addTag('bff')
            .addBearerAuth({
                description: 'Default JWT auth',
                type: 'http',
                in: 'header',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
            })
            .build();
        const documentFactory = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

        const port = AppModule.CONFIGURATION.APP_CONFIG.PORT;
        await app.listen(port);
        Logger.log(`🚀 BFF Application is running on: http://localhost:${port}/${globalPrefix}`);
        Logger.log(`🚀 BFF Application is running on: http://localhost:${port}/${globalPrefix}/docs`);
    } catch (error) {
        Logger.error('Error during application bootstrap', error);
    }
}

bootstrap();
