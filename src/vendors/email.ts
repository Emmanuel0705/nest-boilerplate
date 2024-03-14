import { HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';

export interface IRootmKYCEmail {
  template: string;
  title?: string;
  data?: Record<string, any>;
  support?: boolean;
}

@Injectable()
export class Mailer {
  constructor(private readonly mailerService: MailerService) {}
  //   private readonly mailerService: MailerService;

  public async sendEmail(
    email: string[],
    metaData: IRootmKYCEmail,
  ): Promise<any> {
    try {
      const htmlContent = fs.readFileSync(metaData.template, 'utf8');

      let replacedHtmlContent = htmlContent;

      // Loop through the data object and replace the placeholders in the HTML template
      Object.keys(metaData.data).forEach((placeholder) => {
        replacedHtmlContent = replacedHtmlContent.replace(
          new RegExp(`{{${placeholder}}}`, 'g'),
          metaData.data[placeholder],
        );
      });

      await this.mailerService.sendMail({
        to: [...email], // List of receivers email address
        from: process.env.EMAIL_NAME, // Senders email address
        subject: metaData.title, // Subject line
        html: replacedHtmlContent, // HTML body content
      });
      return;
      // return {
      //   message: 'Verification code has been sent.',
      //   data: 'done',
      //   status: true,
      //   statusCode: HttpStatus.OK,
      // };
    } catch (error) {
      console.log({ error });
    }
  }
}
