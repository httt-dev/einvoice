import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getProcessId } from '@common/utils/string.util';
import { MetadataKeys } from '@common/constants/common.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();
        const { method, originalUrl, body } = req;
        const processId = getProcessId();
        const now = Date.now();
        Logger.log(
            `[${processId}] ${method} ${originalUrl} - Body: ${JSON.stringify(body)} - ${now}`,
            'Request Received',
        );

        (req as any)[MetadataKeys.PROCESS_ID] = processId;
        (req as any)[MetadataKeys.START_TIME] = startTime;

        const originalSend = res.send.bind(res);

        res.send = (body: any) => {
            const durationms = Date.now() - startTime;
            Logger.log(
                `[${processId}] ${method} ${originalUrl} - Response Body: ${JSON.stringify(
                    body,
                )} - ${Date.now()} - ${durationms}ms`,
                'Response Sent',
            );
            return originalSend(body);
        };

        next();
    }
}
