import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizerSerivce {
    private readonly logger = new Logger(AuthorizerSerivce.name);
    private jwksClient: JwksClient;

    constructor(
        private readonly keycloakHttpService: KeycloakHttpService,
        private readonly configService: ConfigService,
    ) {
        // const host = this.configService.get('KEYCLOAK_CONFIG.HOST');
        // const realm = this.configService.get('KEYCLOAK_CONFIG.REALM');
        // const jwksUri = `${host}/realms/${realm}/protocol/openid-connect/certs`;
        // this.logger.debug(`jwksUri=${jwksUri}`);
        // this.jwksClient = jwksRsa({
        //   jwksUri: jwksUri,
        //   cache:true,
        //   rateLimit: true,
        // })
    }

    async login(params: LoginTcpRequest) {
        const { password, username } = params;
        const { access_token: accessToken, refresh_token: refreshToken } =
            await this.keycloakHttpService.exchangeUserToken({ username, password });

        return {
            accessToken,
            refreshToken,
        };
    }

    onModuleInit() {
        const host = this.configService.get('KEYCLOAK_CONFIG.HOST');
        const realm = this.configService.get('KEYCLOAK_CONFIG.REALM');

        if (!host || !realm) {
            this.logger.error(`Missing KEYCLOAK_CONFIG: host=${host}, realm=${realm}`);
            return;
        }

        const jwksUri = `${host}/realms/${realm}/protocol/openid-connect/certs`;
        this.logger.debug(`jwksUri=${jwksUri}`);

        this.jwksClient = jwksRsa({
            jwksUri,
            cache: true,
            rateLimit: true,
        });
    }

    async verifyUserToken(token: string): Promise<AuthorizeResponse> {
        const decoded = jwt.decode(token, { complete: true }) as Jwt;

        if (!decoded || !decoded.header || !decoded.header.kid) {
            throw new UnauthorizedException('Invalid token structure');
        }
        try {
            // get public key
            const key = await this.jwksClient.getSigningKey(decoded.header.kid);

            this.logger.debug('key: ' + decoded.header.kid);

            const publicKey = key.getPublicKey();
            this.logger.debug('publicKey: ' + publicKey);

            const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
            this.logger.debug({ payload });

            return {
                valid: true,
                metadata: {
                    jwt: payload,
                    permissions: [],
                    user: null,
                    userId: null,
                },
            };
        } catch (error) {
            this.logger.error('JWKS/verify error', error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
