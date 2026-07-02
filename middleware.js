const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if(req.method === "GET"){
      req.session.redirectUrl = req.originalUrl;
  }  
    req.flash("error", "Please login first!");
      return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
      // console.log("res.locals.redirectUrl");
      delete req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async( req, res, next) =>{
  const { id } = req.params;
      // console.log(id);
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }
  
      // Owner Check
      if (!listing.owner.equals(req.user._id)) {
        req.flash(
          "error",
          "You are not owner of this listing."
        );
        return res.redirect(`/listings/${id}`);
      }
      next();
}


module.exports.isReviewAuthor = async( req, res, next) =>{
  const { id, reviewId } = req.params;
      // console.log(id);
      const review = await Review.findById(reviewId);
      if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect("/show");
      }
  
      // Owner Check
      if (!review.author.equals(req.user._id)) {
        req.flash(
          "error",
          "You are not author of this review."
        );
        return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.formatImage = (req, res, next) => {
  if (
      req.body.listing &&
      typeof req.body.listing.image === "string"
  ) {
      req.body.listing.image = {
          filename: "listingimage",
          url: req.body.listing.image,
      };
  }
  next();
};