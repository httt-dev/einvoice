import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthorizerSerivce } from '../services/authorizer.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { AuthorizeResponse, LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerController {
    constructor(private readonly authorizerSerivce: AuthorizerSerivce) {}

    @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
    async login(@RequestParams() params: LoginTcpRequest) {
        const result = await this.authorizerSerivce.login(params);
        return Response.success<LoginTcpResponse>(result);
    }

    @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN)
    async verifyUserToken(@RequestParams() token: string) {
        const result = await this.authorizerSerivce.verifyUserToken(token);
        return Response.success<AuthorizeResponse>(result);
    }
}
