import { Module } from '@nestjs/common';
import { PdfService } from './services/pdf.service';
import { PdfController } from './controllers/pdf.controller';

@Module({
    imports: [],
    controllers: [PdfController],
    providers: [PdfService],
    exports: [],
})
export class PdfModule {}
