import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';

class Configuration extends BaseConfiguration {
  APP_CONFIG = new AppConfiguration();
}

export const CONFIGURATION = new Configuration();
// khai bao type cho CONFIGURATION
export type TConfiguration = typeof CONFIGURATION;
