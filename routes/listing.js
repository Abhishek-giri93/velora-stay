const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, formatImage } = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listings");
// multer-
const multer  = require('multer'); 
const{ storage }= require("../cloudConfi.js");
const upload = multer({ storage });


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, 
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing));

//new route-
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, 
    isOwner, 
    validateListing, 
    upload.single('listing[image]'),
    formatImage, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editRender));

module.exports = router;