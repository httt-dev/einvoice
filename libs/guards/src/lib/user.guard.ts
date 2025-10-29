import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constants/common.constant';
import { getAccessToken, setUserData } from '@common/utils/request.util';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer/authorizer.response.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { AuthorizerService } from '@common/interfaces/grpc/authorizer';

@Injectable()
export class UserGuard implements CanActivate {
    private readonly logger = new Logger(UserGuard.name);
    private authorizerService: AuthorizerService;

    constructor(
        private readonly reflector: Reflector,
        @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly auhorizerClient: TcpClient,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(GRPC_SERVICES.AUTHORIZER_SERVICE) private readonly grpcAuthorizerClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authorizerService = this.grpcAuthorizerClient.getService<AuthorizerService>('AuthorizerService');
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authOptions = this.reflector.get<{ secured: boolean }>(MetadataKeys.SECURED, context.getHandler());
        if (!authOptions?.secured) {
            return true;
        }
        const req = context.switchToHttp().getRequest();

        return this.verifyToken(req);
    }

    private async verifyToken(req: any): Promise<boolean> {
        try {
            const token = getAccessToken(req);

            const cacheKey = this.generateTokenCacheKey(token);

            // verify token
            const processId = req[MetadataKeys.PROCESS_ID];

            const cacheData = await this.cacheManager.get<AuthorizeResponse>(cacheKey);

            if (cacheData) {
                setUserData(req, cacheData);
                return true;
            }

            // const result = await this.verifyUserTokenTcp(token, processId);
            const response = await firstValueFrom(this.authorizerService.verifyUserToken({ processId, token }));
            this.logger.debug('verify token response: ', response);

            const { data: result } = response;
            if (!result?.valid) {
                throw new UnauthorizedException('Token is invalid');
            }

            this.logger.debug('Set user data to cache for token ', cacheKey, cacheData);

            // set user data into request
            setUserData(req, result);

            //cache data
            this.cacheManager.set(cacheKey, result, 30 * 60 * 1000);

            // passed
            return true;
        } catch (error) {
            this.logger.error({ error });
            throw new UnauthorizedException('Token is invalid');
        }
    }

    private async verifyUserTokenTcp(token: string, processId: string) {
        return firstValueFrom(
            this.auhorizerClient
                .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN, {
                    data: token,
                    processId,
                })
                .pipe(map((data) => data.data)),
        );
    }

    generateTokenCacheKey(token: string): string {
        const hash = createHash('sha256').update(token).digest('hex');
        return `user-token:${hash}`;
    }
}
