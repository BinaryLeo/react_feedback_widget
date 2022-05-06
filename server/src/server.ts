import express from 'express';
const app = express();
app.use(express.json());
// A middleware that comes first - use to avoid the error: Cannot read property 'json' of undefined

app.post('/feedbacks',(req,res)=>{
console.log(req.body)
return res.send('Hello leo theres no bug n this time')

})
app.listen(3333,() => {
    console.log('Server is running on port 3333');
});