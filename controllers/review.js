const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req,res) => {
    // console.log(req.params);   req.parmas is an empty object here if you don't use mergeParams while defining router
    const listing = await Listing.findById(req.params.id);
    // if(!req.body.review){      //Not required , since now Joi(validateReview) handles it
    //     throw new expressError(400, "Dude, you sent a bad request!")
    // }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();  //Yes, you gotta save again after making changes
    req.flash('success', 'Review Added');
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async (req,res) => {
    const {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/listings/${id}`);
}