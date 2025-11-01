import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

@Injectable()
export class MediaService {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
    uploadFile(params: UploadFileTcpReq): Promise<string> {
        Logger.debug('uploadFile media service data : ', { params });
        // return new Promise((resolve) => resolve('file_uploaded'));
        return this.cloudinaryService.uploadFile(Buffer.from(params.fileBase64, 'base64'), params.fileName);
    }
}
