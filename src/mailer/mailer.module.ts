import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';

@Global()
@Module({
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
