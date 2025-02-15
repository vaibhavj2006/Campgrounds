const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const control = require('../controller/grounds');
const multer=require('multer')
const {storage}=require('../cloud');
const upload=multer({storage});


const validater=(req,res,next)=>{
    
    const {error}=errSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=> e.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}


router.get('/', wrapAsync(control.index));


router.post('/',upload.array('image'),wrapAsync(control.createground));

router.get('/new', control.renderground);

router.get('/:id', wrapAsync(control.rendershow));

router.put('/:id', wrapAsync(control.update));

router.delete('/:id', wrapAsync(control.delete));

router.get('/:id/edit', wrapAsync(control.edit));

module.exports = router;

