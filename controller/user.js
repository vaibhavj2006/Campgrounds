const express=require("express");
const router=express.Router();
const user=require("../model/user.js");

router.get("/reg",async(req,res)=>{
    res.render('users/reg');
})