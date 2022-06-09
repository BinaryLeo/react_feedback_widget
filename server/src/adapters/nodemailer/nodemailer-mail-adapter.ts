import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from "nodemailer";
const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '248ffa2a207505',
      pass: '70a86870e09ca5',
    },
  });
export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({ subject, body }: SendMailData) {
    await transport.sendMail({
      from: "Feedback widget team <sayhi@feedbackteam.com>",
      to: "binaryleo <leomouracss@fastmail.com>",
      subject,
      html: body,
    });
  }
}
