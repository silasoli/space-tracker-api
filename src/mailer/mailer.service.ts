import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailerService {
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;


  constructor(private readonly config: ConfigService) {
    const mailHost = config.get('MAIL_HOST');
    if (!mailHost) throw new BadRequestException('Mail host not configured');

    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
      ignoreTLS: true,
    });
  }

  async sendMail(dto: SendMailDto) {
    if (!this.transporter)
      throw new BadRequestException('Transporter not configured');

    const msg = await this.transporter.sendMail({
      to: dto.mail,
      from: this.config.get('MAIL_FROM'),
      subject: 'Enviando Email com NestJS',
      html: `<h3 style="color: blue">${dto.message}</h3>`,
    });

    if (msg.accepted) return 'Email successfully sent';
  }
}
