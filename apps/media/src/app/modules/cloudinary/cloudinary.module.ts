import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
    imports: [],
    controllers: [],
    providers: [CloudinaryService],
    exports: [CloudinaryService], // de co the inject vao media service
})
export class CloudinaryModule {}
