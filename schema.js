const Joi = require('joi');
// module.exports.listingSchema = Joi.object({  //since you are exporting it as a key, destructure it in the app.js where you are importing this
//     listing: Joi.object({  // ✅ Properly defining "listing" as a key
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().min(0).required(),
//         image: Joi.string().allow("", null), // Allows empty or null values
//     }).required(),
// });


const listingSchema = Joi.object({
    listing: Joi.object({  // ✅ Properly defining "listing" as a key
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().allow("", null), // Allows empty or null values
    }).required(),
});


const reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});
module.exports = {listingSchema,reviewSchema};