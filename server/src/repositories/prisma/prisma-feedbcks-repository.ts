import { prisma } from "../../prisma";
import { FeedbackCreateData, FeedbacksRepository } from "../feedbacks-repository";

export class PrismaFeedbacksRepository implements FeedbacksRepository {
async create({type,comment, screenshot}: FeedbackCreateData){
    await prisma.feedback.create({
        //* await for the feedback to be created ..
        data: {type, comment, screenshot},
      });
}
}