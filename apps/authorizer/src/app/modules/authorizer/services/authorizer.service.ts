import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { User } from '@common/schemas/user.schema';
import { Role } from '@common/schemas/role.schema';

@Injectable()
export class AuthorizerSerivce {
    private readonly logger = new Logger(AuthorizerSerivce.name);
    private jwksClient: JwksClient;

    constructor(
        private readonly keycloakHttpService: KeycloakHttpService,
        private readonly configService: ConfigService,
        @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
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

    async verifyUserToken(token: string, processId: string): Promise<AuthorizeResponse> {
        const decoded = jwt.decode(token, { complete: true }) as Jwt;

        if (!decoded || !decoded.header || !decoded.header.kid) {
            throw new UnauthorizedException('Invalid token structure');
        }
        try {
            // get public key
            const key = await this.jwksClient.getSigningKey(decoded.header.kid);

            // this.logger.debug('key: ' + decoded.header.kid);

            const publicKey = key.getPublicKey();
            // this.logger.debug('publicKey: ' + publicKey);

            const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
            this.logger.debug({ payload });

            const user = await this.userValidation(payload.sub, processId);

            return {
                valid: true,
                metadata: {
                    jwt: payload,
                    permissions: (user.roles as unknown as Role[]).map((role) => role.permissions).flat(1),
                    user: user,
                    userId: user.id,
                },
            };
        } catch (error) {
            this.logger.error('JWKS/verify error', error);
            throw new UnauthorizedException('Invalid token');
        }
    }

    private async userValidation(userId: string, processId: string) {
        const user = await this.getUserByUserId(userId, processId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    private getUserByUserId(userId: string, processId: string) {
        return firstValueFrom(
            this.userAccessClient
                .send<User, string>(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID, {
                    data: userId,
                    processId,
                })
                .pipe(map((data) => data.data)),
        );
    }
}
