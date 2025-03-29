const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const reviewSchema=new Schema({
    body:String,
    rating:Number,
    ovrlscore:Number
});

const rev=mongoose.model('Review',reviewSchema);
module.exports=rev;