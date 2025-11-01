import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { MongoConfiguration } from '@common/configuration/mongo.config';

class Configuration extends BaseConfiguration {
    @ValidateNested()
    @Type(() => AppConfiguration)
    APP_CONFIG = new AppConfiguration();

    @ValidateNested()
    @Type(() => TcpConfiguration)
    TCP_SERV = new TcpConfiguration();

    @ValidateNested()
    @Type(() => MongoConfiguration)
    MONGO_CONFIG = new MongoConfiguration();
}

export const CONFIGURATION = new Configuration();
// khai bao type cho CONFIGURATION
export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
