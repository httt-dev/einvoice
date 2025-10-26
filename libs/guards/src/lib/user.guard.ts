import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constants/common.constant';
import { getAccessToken } from '@common/utils/request.util';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer/authorizer.response.interface';

@Injectable()
export class UserGuard implements CanActivate {
    private readonly logger = new Logger(UserGuard.name);

    constructor(
        private readonly reflector: Reflector,
        @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly auhorizerClient: TcpClient,
    ) {}

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
            // verify token
            const processId = req[MetadataKeys.PROCESS_ID];

            const result = await this.verifyUserToken(token, processId);

            if (!result?.valid) {
                throw new UnauthorizedException('Token is invalid');
            }
            // passed
            return true;
        } catch (error) {
            this.logger.error({ error });
            throw new UnauthorizedException('Token is invalid');
        }
    }

    private async verifyUserToken(token: string, processId: string) {
        return firstValueFrom(
            this.auhorizerClient
                .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN, {
                    data: token,
                    processId,
                })
                .pipe(map((data) => data.data)),
        );
    }
}
