import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger, HttpStatus } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const now = Date.now();
        const handler = context.getHandler();
        const handlerName = handler.name || 'unknown_handler';

        const args = context.getArgs();
        const param = args[0];
        const processId = param?.processId || 'unknown_processId';

        Logger.log(
            `[TCP][${handlerName}] - ProcessId: ${processId} - method: ${handlerName} with params: ${JSON.stringify(
                param,
            )} at ${now}  - Start processing request...`,
        );

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - now;
                Logger.log(
                    `[TCP][${handlerName}] - ProcessId: ${processId} - method: ${handlerName}  - Finished processing request in ${duration}ms`,
                );
            }),
            catchError((error) => {
                const duration = Date.now() - now;
                Logger.error(
                    `[TCP][${handlerName}] - ProcessId: ${processId} - method: ${handlerName} - message: ${
                        error.message
                    } -data: ${JSON.stringify(error)}  after ${duration}ms`,
                );

                throw new RpcException({
                    code: error.status || error.code || error.error?.code || HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error?.response?.message || error?.message || HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
            }),
        );
    }
}
