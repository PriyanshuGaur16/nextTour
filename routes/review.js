const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema} = require("../schema.js");
const expressError = require("../utils/ExpressError");
const reviewController = require("../controllers/review.js");
const {isLoggedIn,isAuthor} = require("../middleware");
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }else{
        next();
    }
}

//Post a review
router.post("/" ,isLoggedIn,validateReview, wrapAsync (reviewController.createReview))

//Delete a review
router.delete("/:reviewId",isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;