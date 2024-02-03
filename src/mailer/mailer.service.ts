import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';
import { ERRORS } from '../common/utils/constants/errors';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { SendMailDto } from './dto/send-mail.dto';
import { SendMailWithTemplateDto } from './dto/send-mail-with-template.dto';
import { FormatUtil } from '../common/utils/formatters/format.util';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly config: ConfigService) {
    const mailHost = config.get('MAIL_HOST');
    if (!mailHost) throw ERRORS.MAILER.MAIL_HOST;

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

  public sendEmailWithTemplate(
    dto: SendMailWithTemplateDto,
    context: object,
    template: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const filename = path.join(
      process.cwd(),
      'src/common/emails',
      `${template}.ejs`,
    );

    if (!fs.existsSync(filename)) throw ERRORS.MAILER.NOT_FOUND_TEMPLATE;

    const templateString = fs.readFileSync(filename, { encoding: 'utf-8' });

    const body = ejs.render(templateString, { context });

    return this.emailSender({
      emailAddress: dto.emailAddress,
      title: dto.title,
      message: body,
    });
  }

  private async emailSender(
    dto: SendMailDto,
  ): Promise<SMTPTransport.SentMessageInfo> {
    if (!this.transporter) throw ERRORS.MAILER.TRANSPORTER;

    return this.transporter.sendMail({
      to: dto.emailAddress,
      from: this.config.get('MAIL_FROM'),
      subject: dto.title,
      html: dto.message,
    });
  }

  @Cron('0 0 0 * * 5')
  private async weeklyEmailTestCron(): Promise<void> {
    this.logger.log('Starting weekly email test cron.');

    const email = await this.emailSender({
      emailAddress: this.config.get('MAIL_TEST_TO'),
      title: 'Space Tracker API',
      message: `Teste de email semanal - Dia: ${FormatUtil.toPTBRDateString(new Date())}.`,
    });

    if (!email.accepted) this.logger.error(ERRORS.MAILER.WEEKLY_TEST);

    this.logger.log('Finalizando o cron de teste de e-mail semanal.');
  }
}
