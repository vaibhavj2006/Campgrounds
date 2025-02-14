 const joi=require('joi');
 module.exports.errSchema = joi.object({
        ground:joi.object({
          title:joi.string().required(),
          price:joi.number().required().min(1),
          image:joi.string().required(),
          location:joi.string().required(),
          description:joi.string().required()
        })
    });


 