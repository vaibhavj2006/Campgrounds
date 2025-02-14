const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const review=require('./review')

const groundSchema=new Schema({
    title:String,
    image:String,
    description:String,
    location:String,
    price:Number,
    review: [
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});


groundSchema.post('findOneAndDelete',async function(doc) {
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.review
            }
        })
    }
})

const camp=mongoose.model('ground',groundSchema);
module.exports=camp;
