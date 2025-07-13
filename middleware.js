const Listing = require("./models/listing");
const Review = require("./models/review");
function isLoggedIn(req, res, next) { //for protecting the route
    if (req.isAuthenticated()) {
        return next(); // user is logged in, move on
    }
    //We have to store the originalUrl only when user is not logged in, coz if he is logged in he will be redirected directly to the write page
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in first!');
    res.redirect('/login');
};

function saveRedirectUrl(req,res,next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();  //outside if condition
}

async function isOwner(req,res,next){
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){  //middleware for authorization, 
        req.flash("error","You don't have permission for this");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}

async function isAuthor(req,res,next){  //only author can delete his review, not anybody
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){  //middleware for authorization, 
        req.flash("error","You aren't the author of this listing");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}

module.exports = {isLoggedIn, saveRedirectUrl, isOwner,isAuthor};