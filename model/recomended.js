
const mongoose=require('mongoose');



const recSchema=new mongoose.Schema({
    review:{
        type:String
    },
    rating:{
        type:Number
    }
});

const rec=mongoose.model('Recomend',recSchema)

module.exports=rec;