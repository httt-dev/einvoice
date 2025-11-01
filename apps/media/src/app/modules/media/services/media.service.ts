import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
import { Injectable, Logger } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class MediaService {
    uploadFile(params: UploadFileTcpReq): Promise<string> {
        Logger.debug('uploadFile media service data : ', { params });
        return new Promise((resolve) => resolve('file_uploaded'));
    }
}
