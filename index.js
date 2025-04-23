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
const LocalStratergy=require('passport-local');
const user=require('./model/user')
const passportLocalMongoose=require('passport-local-mongoose');
const flash=require('connect-flash')


//routes
const grounds=require('./routes/grounds')
const reviews=require('./routes/review')
const users=require('./routes/users')



const app=express();


mongoose.connect('mongodb://127.0.0.1:27017/ground')


const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("dtabase connected");
})

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.set('public',path.join(__dirname,'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs',ejsMate)

app.use(express.urlencoded({ extended: true}))
app.use(methodover('_method'))
app.use(express.static('public'))

const sessionConfig = {
    secret: 'secret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const auth=async(req,res)=>{
    if(!req.isAuthenticate()){
        req.flash('error',"you must signed in!")
         res.redirect('/login')
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStratergy(user.authenticate()))


passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser());

//app.use('/',users)
app.use('/ground',grounds)
app.use('/ground/:id/review',reviews)

app.get('/reg',async(req,res)=>{
    res.render('users/reg');
})

app.post('/register',async(req,res)=>{
   const {username,email,password} = req.body;
   const userr=new user({ email, username});
   const ress=await user.register(userr,password);
  req.flash('successs',"registered!")
   res.redirect('/ground');
})

app.get('/login',async(req,res)=>{
    res.render('users/login');
 })
 
 
app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), async(req,res)=>{
    req.flash('success',"welcome back")
    res.redirect('/ground');
 })

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



