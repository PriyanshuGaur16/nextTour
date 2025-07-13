const express = require("express");
const session = require('express-session');
var flash = require('connect-flash');
const path = require("path");
// const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views") );
app.use(flash());
// app.use(cookieParser("secretkey"));  //to access req.cookies
// app.get("/getsignedcookies" , (req,res) => {
//     res.cookie("Hello" , "Dude",{signed : true});
//     res.cookie("Come_on", "lets go!!", {signed : true}); //no space allowed in name of the name-value pair
//     res.send("Sent you some cookies");
// })

// app.get("/verify" , (req,res) => {
//     console.log(req.signedCookies);
//     res.send("Verified");
// })

// app.get("/root" , (req,res) => {
//     res.send("This is another web page of the same site")
//     console.dir(req.cookies);
// })

// app.get("/greet" ,(req,res) => {
//     let {name = "noname"} = req.cookies;  //noname is default value, assigned if there is no "name" in cookies
//     res.send(`Hello ${name}`); 
// })
app.use(session({secret : "mysecretsuperstring",
    resave: false,
  saveUninitialized: true,
}));

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/request" ,(req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "User not registerd");
    }else  req.flash('success', 'user registered successfully');
    res.redirect("/hello");
})

app.get("/hello" , (req,res) => {
   
    res.render('try.ejs', { name : req.session.name});
})

// app.get("/reqCount" , (req,res) => {
//     if(req.session.count){
//         req.session.count ++;
//     }else req.session.count = 1;
//     res.send(`You sent the request ${req.session.count} times`);
// })
// app.get("/test" , (req,res) => {
//     console.log(req.session);
//     res.send("test successful");
// })



app.listen(port , () => {
    console.log("Server has started at 3000")
})