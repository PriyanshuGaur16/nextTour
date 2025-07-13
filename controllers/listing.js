const Listing = require("../models/listing")
const { listingSchema } = require("../schema.js");
const searchLocation = require("../utils/searchLocation.js");
const expressError = require("../utils/ExpressError.js");
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  }

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path : "reviews", populate : {path : "author"}})  //nested populate
      .populate("owner"); 
    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

module.exports.postListing = async (req, res) => {
    //instead of these if conditons, you can simply pass validateListing function after the route(passing middleware in app.get, app.post etc)
    if (!req.body.listing) {
      throw new expressError(400, "Send valid data"); //not mentioned 'next' explicitely(next(new ExpressError(400,"Send valid data"))) because wrapAsync handles it
    }
    let url = req.file.path;
    let filename = req.file.filename;
    // let result = listingSchema.validate(req.body); //Server side validation, validate keyword belongs to joi
    // if (result.error) {
    //   throw new expressError(400, result.error);
    // }
    let newlisting = new Listing(req.body.listing);
    newlisting.image = {url,filename};
    newlisting.owner = req.user._id;
    const coords = await searchLocation(req.body.listing.location);
    if(coords){
      newlisting.geometry = {
        type: "Point",
        coordinates: [coords.lon, coords.lat], // Note: [lon, lat] — GeoJSON format
      };
    }
    await newlisting.save();
    req.flash("success", "New Destination Added");
    res.redirect("/listings");
  }

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(req.user._id)) {
      //for authorization, instead of writing this logic for every route, put this in a middleware
      req.flash("error", "You don't have permission for this");
      return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //You can write (id, req.body.listing) but for security purposes, don't write. Check Chatgpt
    if(req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
    req.flash("success", "Destination Updated");
    res.redirect(`/listings/${id}`); //Don't write /listings/:id
  }

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Destination Deleted");
    res.redirect("/listings");
  }