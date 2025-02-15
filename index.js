if(process.env.NODE_ENV !== "production"){
     require('dotenv').config();
}

const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const ground=require('./model/grounds');
const methodover=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const joi=require('joi');
const { title } = require('process');
const ExpressError=require('./utils/errors');
const {errSchema}=require('./errorSchema.js');
const review=require('./model/review');



//routes
const grounds=require('./routes/grounds')
const reviews=require('./routes/review')


const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/ground')


const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("dtabase connected");
})

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.engine('ejs',ejsMate)

app.use(express.urlencoded({ extended: true}))
app.use(methodover('_method'))
app.use(express.static('public'))


//routes
app.use('/ground',grounds)
app.use('/ground/:id/review',reviews)


app.listen(8080,()=>{
    console.log("server on")
})

app.all(/(.*)/, (req, res, next) => {
      next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode= 500 }=err;
    if(!err.message) err.message='oh no, Something went wrong'
    res.status(statusCode).render('error',{ err })
})

