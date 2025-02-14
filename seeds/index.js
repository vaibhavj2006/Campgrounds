const express=require('express');
const mongoose=require('mongoose');
const cities=require('./cities')
const path=require('path');
const ground=require('../model/grounds')

const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/ground')


const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("dtabase connected");
});

const seedDB=async()=>{
     await ground.deleteMany({});
    // const c= new ground({title: 'chennai'});
    // await c.save();

    for(let i=0;i<5;i++){
        const c= new ground({title: `${cities[i].title}`,
            location: `${cities[i].location}`,
            description:`${cities[i].description}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: `${cities[i].price}`});
            
            
        await c.save();
    }

}
seedDB()
.then(()=>{
  mongoose.connection.close();
})