import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gateway/authorizer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
@Controller('authorizer')
@ApiTags('Authorizer')
export class AuthorizerController {
    constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authoizerClient: TcpClient) {}

    @Post('login')
    @ApiOkResponse({
        type: ResponseDto<LoginResponseDto>,
    })
    @ApiOperation({
        summary: 'Login with username and password',
    })
    login(@Body() body: LoginRequestDto, @ProcessId() processId: string) {
        return this.authoizerClient
            .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
                data: body,
                processId,
            })
            .pipe(map((data) => new ResponseDto(data)));
    }
}
