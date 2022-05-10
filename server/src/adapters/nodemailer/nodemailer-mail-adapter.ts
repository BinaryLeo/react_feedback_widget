import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from "nodemailer";
const transport = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 2525,
    auth: {
        user: process.env.USERMAIL,
        pass: process.env.USERPASS,
    },
});
export class NodemailerMailAdapter implements MailAdapter {
    async sendMail({subject,body}: SendMailData) {
        await transport.sendMail({
            from:'Feedback widget team <sayhi@feedbackteam.com>',
            to:'binaryleo <leomouracss@fastmail.com>',
            subject,
            html:body,
           })  
    }
}