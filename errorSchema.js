 const joi=require('joi');
 module.exports.errSchema = joi.object({
        ground:joi.object({
          title:joi.string().required(),
          price:joi.string().required(),
          image:joi.string().required(),
          location:joi.string().required(),
          description:joi.string().required()
        })
    });


 