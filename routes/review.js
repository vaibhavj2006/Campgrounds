const express=require('express');
const router=express.Router({mergeParams:true});


const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/errors');

const ground=require('../model/grounds');

const {errSchema}=require('../errorSchema.js');
const review=require('../model/review');



router.post('/',wrapAsync(async(req,res)=>{
    const grounds=await ground.findById(req.params.id);
    const rev=new review(req.body.review);
    grounds.review.push(rev);
    await rev.save();
    await grounds.save();
    res.redirect(`/ground/${grounds._id}`)
}))

router.delete('/:review_id',async(req,res)=>{
    const {id,review_id}=req.params;
    await ground.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await review.findByIdAndDelete(review_id);
    res.redirect(`/ground/${id}`)
})

module.exports=router;