const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    
    const { search, category } = req.query; 
    let query = {};

   
    if (category) {
      query.category = category;
    }

    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ];
    }

    const allListing = await Listing.find(query);
    res.render("listings/index", { allListing });

  } catch (err) {
    console.error("Search index error:", err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
}

// New form-
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
}

//show route -
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash(
      "error",
      "Listing you requested does not exist!"
    );
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
}

// create listing-
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "---", filename);
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
}

// render edit-
module.exports.editRender = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash(
      "error",
      "Listing you are trying to edit doesn't exist!"
    );
    return res.redirect("/listings");
  }
  // Owner Check
  if (!listing.owner.equals(req.user._id)) {
    req.flash(
      "error",
      "You don't have permission to edit this listing."
    );
    return res.redirect(`/listings/${id}`);
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
  console.log(originalImageUrl);
  res.render("listings/edit", { listing , originalImageUrl});
}

// update route-

module.exports.updateListing = async (req, res) => {

  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    
    listing.image = { url, filename };
    await listing.save();

  }
  
  req.flash(
    "success",
    "Listing Updated Successfully!"
  );

  res.redirect(`/listings/${id}`);
}

//Delete route-
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }



  await Listing.findByIdAndDelete(id);

  req.flash(
    "success",
    "Listing Deleted Successfully!"
  );

  res.redirect("/listings");
}