const express = require('express');
const router = express.Router();
const ground=require('../model/grounds');

module.exports.index = async (req, res) => {
    const grounds = await ground.find({});
    res.render('grounds/home', { grounds });
};

module.exports.renderground = async (req, res) => {
    res.render('grounds/create');
};

module.exports.createground = async (req, res, next) => {
    const newground = new ground(req.body.ground);
    newground.image=req.files.map(f=>({url:f.path, filname:f.filename}))
    await newground.save();
    res.redirect(`/grounds/${newground._id}`);  
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
    res.redirect(`/grounds/${newground._id}`); 
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await ground.findByIdAndDelete(id);
    res.redirect('/grounds');  
};
