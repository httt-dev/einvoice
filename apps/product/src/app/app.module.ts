import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { ProductModule } from './modules/product/product.module';
@Module({
    imports: [
        // Global Configuration Module
        ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
        ProductModule,
    ],
})
export class AppModule {
    static CONFIGURATION: TConfiguration = CONFIGURATION;
}
