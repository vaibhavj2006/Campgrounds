const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/errors');
const ground=require('../model/grounds');
const {errSchema}=require('../errorSchema.js');
const review=require('../model/review');
const control=require('../controller/review')



router.post('/',wrapAsync(control.create))

router.delete('/:review_id',control.delete)

module.exports=router;