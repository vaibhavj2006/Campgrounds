const review=require('../model/review')
const ground=require('../model/grounds');

module.exports.create=async(req,res)=>{
    const grounds=await ground.findById(req.params.id);
    const rev=new review(req.body.review);
    grounds.review.push(rev);
    await rev.save();
    await grounds.save();
    res.redirect(`/ground/${grounds._id}`)
}

module.exports.delete=async(req,res)=>{
    const {id,review_id}=req.params;
    await ground.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await review.findByIdAndDelete(review_id);
    res.redirect(`/ground/${id}`)
}