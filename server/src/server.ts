import express from 'express';
import { prisma } from './prisma';
import { StatusCodes } from 'http-status-codes';
const app = express();
app.use(express.json());
//* A middleware that comes first - use to avoid the error: Cannot read property 'json' of undefined.

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body //*destructuring
  const feedback = await prisma.feedback.create({
    //* await for the feedback to be created ... then ...
    data: { type, comment, screenshot },
  })
  return res.status(StatusCodes.OK).json({ data: feedback });
   //* ...  when .. created ←  →  return the response.
})
app.listen(3333, () => {
  console.log('Server is running on port 3333');
})
