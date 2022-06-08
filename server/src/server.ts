import express from 'express';
import cors from 'cors';
import { routes } from './routes';
const app = express();
app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(routes);
app.listen(process.env.PORT || 3333, () => {
  console.log('Server is running on port 3333');
})
