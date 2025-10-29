import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { HttpStatus } from '@nestjs/common';

export class Response<T> {
    code = HTTP_MESSAGE.OK;
    data?: T;
    error = '';
    statusCode?: number;

    constructor(data: Partial<Response<T>>) {
        this.code = data.code ?? HTTP_MESSAGE.OK;
        this.data = data.data;
        this.error = data.error ?? '';
        this.statusCode = data.statusCode ?? HttpStatus.OK;
    }

    static success<T>(data?: T) {
        return new Response<T>({
            code: HTTP_MESSAGE.OK,
            error: '',
            data,
            statusCode: HttpStatus.OK,
        });
    }
}

export type ResponseType<T> = Response<T>;
