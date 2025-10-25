import { Module } from '@nestjs/common';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerSerivce } from './services/authorizer.service';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
    imports: [KeycloakModule], // su dung module keycloak
    controllers: [AuthorizerController],
    providers: [AuthorizerSerivce],
    exports: [],
})
export class AuthorizerModule {}
