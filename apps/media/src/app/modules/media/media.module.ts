import { Module } from '@nestjs/common';
import { MediaService } from './services/media.service';
import { MediaController } from './controllers/media.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [CloudinaryModule], // do co su dung CloudinaryService
    controllers: [MediaController],
    providers: [MediaService],
    exports: [],
})
export class MediaModule {}
