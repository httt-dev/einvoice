import { HttpStatus } from '@nestjs/common';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
    @ApiProperty({ type: String })
    message = HTTP_MESSAGE.OK;

    @ApiProperty()
    data?: T;

    @ApiProperty()
    processId?: string;

    @ApiProperty({ type: Number })
    statusCode = HttpStatus.OK;

    @ApiProperty({ type: String })
    duration?: string;

    constructor(data: Partial<ResponseDto<T>>) {
        Object.assign(this, data);
    }
}
