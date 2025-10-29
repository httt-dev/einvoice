import { Controller, Logger } from '@nestjs/common';
import { AuthorizerSerivce } from '../services/authorizer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { VerifyUserTokenRequest, VerifyUserTokenResponse } from '@common/interfaces/grpc/authorizer';
import { Response } from '@common/interfaces/grpc/common/response.interface';

@Controller()
export class AuthorizerGrpcController {
    constructor(private readonly authorizerService: AuthorizerSerivce) {}

    @GrpcMethod('AuthorizerService', 'verifyUserToken')
    async verifyUserToken(params: VerifyUserTokenRequest): Promise<VerifyUserTokenResponse> {
        Logger.debug('verifyUserToken grpc call ', params);
        const result = await this.authorizerService.verifyUserToken(params.token, params.processId);
        return Response.success(result);
    }
}
