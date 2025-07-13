const express = require("express");
const passport = require("passport");
const router = express.Router();
const {isLoggedIn} = require("../middleware");
const {saveRedirectUrl} = require("../middleware");
const userController = require("../controllers/user");

router.get("/signup" , userController.renderSignUpForm)

router.post("/signup", userController.signup )

router.get("/login" , userController.renderLoginForm)

router.post("/login" ,saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }), //"local" is the name of the strategy, don't write "LocalStrategy" that you defined. 'local' is the default name Passport uses when you register a local strategy.
userController.login )

router.get("/change-password",isLoggedIn,userController.renderChangePw)

router.post("/change-password",isLoggedIn,userController.changePw );

router.get("/logout" , userController.logout )


module.exports = router;
