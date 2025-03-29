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
const session=require('express-session')
const passport=require('passport')
const passportlocal=require('passport-local');
const user=require('./model/user')
const passportLocalMongoose=require('passport-local-mongoose');

//routes
const grounds=require('./routes/grounds')
const reviews=require('./routes/review')
const users=require('./routes/users')


const app=express();
const sessioncofig={
    secret:'sui',
    resave:false,
    saveUninitialized: true
    
}

mongoose.connect('mongodb://127.0.0.1:27017/ground')


const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("dtabase connected");
})

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs',ejsMate)

app.use(express.urlencoded({ extended: true}))
app.use(methodover('_method'))
app.use(express.static('public'))


app.use(session(sessioncofig))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportlocal(user.authenticate()))


passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser());

app.use('/',users)
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
    if(!err.message) err.message='oh noo, Something went wrong'
    res.status(statusCode).render('error',{ err })
})



