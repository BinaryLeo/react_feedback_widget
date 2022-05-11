import { SubmitFeedbackUseCase } from "./submit-feedback-use-case";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();
const submitFeedback = new SubmitFeedbackUseCase(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
  
  )
describe('SubmitFeedback',()=>{
    it('should send feedback', async()=>{
      
       await expect(submitFeedback.execute({
            type: 'bug',
            comment: 'bug comment',
            screenshot: 'data:image/png;base64,894545f5df',
        })).resolves.not.toThrow();
        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    });
    it('should not be able to submit a feedback without types', async()=>{
  
        await expect(submitFeedback.execute({
             type: '',
             comment: 'bug comment',
             screenshot: 'data:image/png;base64,894545f5df',
         })).rejects.toThrow();
     });
     it('should not be able to submit a feedback without a comment', async()=>{
       
         await expect(submitFeedback.execute({
              type: 'BUG',
              comment: '',
              screenshot: 'data:image/png;base64,894545f5df',
          })).rejects.toThrow();
      });
      it('should not be able to submit feedback with an invalid screenshot', async()=>{
       
         await expect(submitFeedback.execute({
              type: 'BUG',
              comment: 'everything is wrong',
              screenshot: '564',
          })).rejects.toThrow();
      });
});

