const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// create review-
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  newReview.author = req.user._id;
  
  await newReview.save();
  await listing.save();

  console.log("New review saved!!");
  req.flash("success", "New review saved successfully!");
  res.redirect(`/listings/${listing._id}`);
}

//delete review-
module.exports.deleteReview = async (req, res) => {
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}