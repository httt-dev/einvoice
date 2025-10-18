import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIGURATION, TConfiguration } from '../configuration';
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    static CONFIGURATION: TConfiguration = CONFIGURATION;
}
