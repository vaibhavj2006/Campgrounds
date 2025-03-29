const express=require('express');
const router=express.Router();

const User=require('../model/user');


router.get('/register',(req,res)=>{
    res.render('users/auth')
})

router.post('/register',async(req,res)=>{
    const {email,username,password} = req.body
    const newUser=new User({email,username});
    const reg=await User.register(newUser,password);
    console.log(reg)
    res.redirect('/ground');  
})

module.exports = router;
