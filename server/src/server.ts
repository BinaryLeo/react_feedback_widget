import express from 'express';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';
import { StatusCodes } from 'http-status-codes';
import { env } from 'process';
const app = express();
app.use(express.json());
//* A middleware that comes first - use to avoid the error: Cannot read property 'json' of undefined.
const transport = nodemailer.createTransport({
  host: process.env.SMTP,
  port: 2525,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USERPASS
  }
});
app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body //*destructuring
  const feedback = await prisma.feedback.create({
    //* await for the feedback to be created ... then ...
    data: { type, comment, screenshot },
  })
  await transport.sendMail({
   from:'Feedback widget team <sayhi@feedbackteam.com>',
   to:'binaryleo <leomouracss@fastmail.com>',
   subject: 'New feedback',
   html:[
     `<div style="font-family:sans-serif; font-size:16px; color:#222>`,
     `<p>Feedback type ${type}</p>`,
     `<p>Coment: ${comment}</p>`,
     `</div>`
   ].join('')
  })
  return res.status(StatusCodes.OK).json({ data: feedback });
   //* ...  when .. created ←  →  return the response.
});
app.listen(3333, () => {
  console.log('Server is running on port 3333');
})
