const User = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs")
}

//submit signup
module.exports.submitSignup = async (req, res, next) => {
  try{
  let { username, email, password } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "Welcome to the Velora Stay.");
    res.redirect("/listings");
  });
  
  } catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

//login-
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
}

//login-
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Velora Stay!");

  let redirectUrl = res.locals.redirectUrl || "/listings";

  res.redirect(redirectUrl);
}


//logout-
module.exports.logout =  (req,res,next)=>{
  req.logout((err) =>{
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
}

