const express = require('express');
const router = express.Router();
const ground=require('../model/grounds');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();



module.exports.home = async(req, res) => {
    const grounds = await ground.find({});
    res.render('grounds/first', { grounds });
};


module.exports.index = async (req, res) => {
    
  const grounds = await ground.find({}).populate('review');
  const sum= new Map();
  
  grounds.forEach(grd => {
   
    if (grd.review && grd.review.length > 0) {
      let summ = 0;
  
      grd.review.forEach(r => {
        const result = sentiment.analyze(r.body); 
        summ += result.score + r.rating; 
      });
  
      sum.set(grd._id, {
        title:grd.title ,
        image:grd.image,
        discription:grd.description,
        location:grd.location,
        price:grd.price,
        id:grd._id,
        score:summ
       });
    }
  });
  const arr = new Map(
    Array.from(sum).sort((a, b) => b[1].score - a[1].score)
  );
  
    res.render('grounds/home', { grounds, arr});
};




module.exports.renderground = async (req, res) => {
    res.render('grounds/create');
};

module.exports.createground = async (req, res, next) => {
    const newground = new ground(req.body.ground);

    await newground.save();
    res.redirect(`/ground/${newground._id}`);  
};

module.exports.rendershow = async (req, res) => {
    const grounds = await ground.findById(req.params.id).populate('review');
    
    res.render('grounds/show', { grounds });
};

module.exports.edit = async (req, res) => {
    const grounds = await ground.findById(req.params.id);
    res.render('grounds/edit', { grounds });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const newground = await ground.findByIdAndUpdate(id, { ...req.body.ground });
    res.redirect(`/ground/${newground._id}`); 
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await ground.findByIdAndDelete(id);
    res.redirect('/ground');  
};
