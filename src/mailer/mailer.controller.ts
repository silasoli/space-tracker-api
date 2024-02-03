import { Body, Controller, Post } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { ApiTags } from '@nestjs/swagger';
import { MailerService } from './mailer.service';

@ApiTags('Mail')
@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  // @Post('send-mail')
  // sendMail(@Body() dto: SendMailDto) {
  //   return this.mailerService.emailSender(dto);
  // }

  @Post('send-mail')
  sendMail() {
    return this.mailerService.sendEmailWithTemplate('rental-notification');
  }
}