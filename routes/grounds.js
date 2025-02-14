const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/errors');
const ground=require('../model/grounds');
const {errSchema}=require('../errorSchema.js');

const validater=(req,res,next)=>{
    
    const {error}=errSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=> e.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

router.get('/',async (req,res)=>{
    const grounds=await ground.find({});
    res.render('grounds/home',{grounds})
})


router.get('/new',async(req,res)=>{
    res.render('grounds/create')
})


router.post('/',validater, wrapAsync(async(req,res,next)=>{
    const newground=new ground(req.body.ground)
    await newground.save();
    res.redirect(`/ground/${newground._id}`)
}))

router.get('/:id',async(req,res)=>{
    const grounds=await ground.findById(req.params.id).populate('review');
    res.render('grounds/show',{grounds})
})

router.get('/:id/edit',validater,wrapAsync(async(req,res)=>{
    const grounds=await ground.findById(req.params.id);
    res.render('grounds/edit',{grounds})
}))

router.put('/:id',validater,wrapAsync(async(req,res)=>{
    const { id }=req.params;
    const newground=await ground.findByIdAndUpdate(id,{...req.body.ground})
    res.redirect(`/ground/${newground._id}`)
}))

router.delete('/:id',async(req,res)=>{
    const { id }=req.params;
    const grounds=await ground.findByIdAndDelete(req.params.id);
    res.redirect('/ground')
})

module.exports=router;

