import { Controller, Get } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import path from 'path';

@Controller()
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Get()
    async printPdf() {
        const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');

        return await this.pdfService.generatePdfFromEjs(templatePath, { invoice: { id: 1 } });
    }
}
