import express from "express";
import nodemailer from "nodemailer";
import { StatusCodes } from "http-status-codes";
import { SubmitFeedbackUseCase } from "./use-cases/submit-feedback-use-case";
import { PrismaFeedbacksRepository } from "./repositories/prisma/prisma-feedbcks-repository";
import { NodemailerMailAdapter } from "./adapters/nodemailer/nodemailer-mail-adapter";
export const routes = express.Router();
const transport = nodemailer.createTransport({
  host: process.env.SMTP,
  port: 2525,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USERPASS,
  },
});
routes.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;
  const prismaFeedbackRepository = new PrismaFeedbacksRepository();
  const nodemailerMailAdapter = new NodemailerMailAdapter();
  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbackRepository,
    nodemailerMailAdapter
  );

  await submitFeedbackUseCase.execute({
    type,
    comment,
    screenshot,
  });

  return res.status(StatusCodes.OK).send();
});
