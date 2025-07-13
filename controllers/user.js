const User = require("../models/user");

module.exports.renderSignUpForm = (req,res) => {
    res.render("users/signup.ejs")
}

module.exports.signup =  async (req,res) => {
    try{
        let {username, email, password} = req.body;  //object destructuring
        let newUser = new User({
            email : email,              //or simply email, username
            username : username
        })
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser , (err) => {  //to automatically login the user as soon as he/she signs up
            if(err) return next(err);
            req.flash("success", "User registerd successfully");
            res.redirect("/listings");
        })
    }catch(err){   //if same username already exists
        req.flash('error', err.message);
        res.redirect('/signup');
    }
   
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs")
}

module.exports.login = (req,res) => {
    req.flash("success", "Welcome Back!");
    // res.redirect(req.session.redirectUrl);  //passport after authentication resets req.session, therefore req.session.redirectUrl becomes undefined  
    let redirectUrl = res.locals.redirectUrl || "/listings" ;  //if res.locals.redirectUrl is undefined() when isLoggedin don't get executed
    res.redirect(redirectUrl);                              
}

module.exports.renderChangePw =  (req,res) => {  //isLoggedIn middleware
    res.render("users/changepw.ejs")
}

module.exports.changePw = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = req.user; // assuming user is authenticated via passport

        await new Promise((resolve, reject) => {
            user.changePassword(oldPassword, newPassword, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.flash("success", "Password changed successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to change password. " + err.message);
        res.redirect("/change-password");
    }
}

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
}