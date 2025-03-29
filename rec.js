const mongoose=require('mongoose');
const express=require('express');
const app=express();
const ground=require('./model/grounds')
const rec=require('./model/recomended');
const review=require('./model/review')
const Recomend=require('./model/recomended')
const path=require('path');


const Sentiment = require('sentiment');
const sentiment = new Sentiment();




mongoose.connect('mongodb://127.0.0.1:27017/ground')
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("dtabase connected");
    
})

const sum=new Map();

  sum.set(1,"jod")

//console.log(sum)
//sum.set({ id: 1 }, { name: "new name for jod" });

app.use('/rec', async (req, res) => {
  const grounds = await ground.find({}).populate('review');

  const sum = new Map();
  
 
  grounds.forEach(grd => {
   
    if (grd.review && grd.review.length > 0) {
      let summ = 0;
  
      grd.review.forEach(r => {
        const result = sentiment.analyze(r.body); 
        summ += result.score + r.rating; 
      });
  
      sum.set(grd._id, {
        title:grd.title ,
        image:grd.image,
        discription:grd.description,
        location:grd.location,
        price:grd.price,
        id:grd._id,
        score:summ
       });
    }
  });
  const sortedSum = new Map(
    Array.from(sum).sort((a, b) => b[1].score - a[1].score)
  );
  console.log(sortedSum)
  for(let [key,value] of sum){
  console.log(value.title);
  }
  
res.send("Sentiment analysis completed");
  
});


app.listen(8080,()=>{
    console.log("server on")
})