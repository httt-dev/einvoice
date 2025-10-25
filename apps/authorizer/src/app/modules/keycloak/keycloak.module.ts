import { Module } from '@nestjs/common';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakHttpService } from './services/keycloak-http.service';

@Module({
    imports: [],
    controllers: [KeycloakController],
    providers: [KeycloakHttpService],
    exports: [],
})
export class KeycloakModule {}
