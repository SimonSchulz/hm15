import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as process from 'node:process';
import type { SendMailOptions } from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter: ReturnType<typeof nodemailer.createTransport>;
  private email: string;

  constructor() {
    this.email = 'testovich43@yandex.com';
    this.transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: this.email,
        pass: 'aptxjotmglrugrdu',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(
    to: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: `"Blogs platform" <${this.email}>`,
      to,
      subject: 'Email Confirmation',
      html: template(code),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error occurred');
      }
    }
  }
}
