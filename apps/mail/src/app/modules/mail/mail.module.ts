import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';

@Module({
    imports: [],
    providers: [MailService],
    controllers: [],
    exports: [MailService],
})
export class MailModule {}
