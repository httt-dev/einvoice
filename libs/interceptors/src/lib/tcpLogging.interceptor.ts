import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

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
        );
    }
}
