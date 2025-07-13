const express = require("express");
if(process.env.NODE_ENV!="production"){   //use only in development phase not production
    require('dotenv').config()
};
const path = require("path");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const expressError = require("./utils/ExpressError");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
var flash = require('connect-flash');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const app = express();
var methodOverride = require('method-override');
const port = 8080;
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
// const {listingSchema} = require("./schema.js");
app.engine("ejs" , ejsMate);
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views") );
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(flash());

const dbUrl = process.env.ATLASDB_URL;    //mongo atlas database

main()
    .then((res) => {console.log("connected to dB")})
    .catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/nextTour');
  await mongoose.connect(dbUrl);
}

const store =  MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})
store.on("error", (err) => {
    console.log("ERROR in mongo session store", err)
})

let sessionObject = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};



app.use(session(sessionObject));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //“Hey Passport, here's a new strategy instance based on LocalStrategy. Use it, and by default, its name will be 'local'.”
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.get('/' , (req,res) => {
    res.send("This is working");
})

// app.get('/testing', async (req,res) => {
//     let list1 = new Listing({
//         title : "seaView",
//         description : "Sitting avaliable",
//         price : 4000,
//         location : "Athens",
//         country : "Greece"
//     })
//     await list1.save();
//     res.send("document saved");
// })

app.get("/demoUser", async (req,res) => {
    let fakeUser = new User({
        email : "pg27@gmail.com",
        username : "PriyaG27"
    })
    let demoUser = await User.register(fakeUser, "hellopw"); //hellopw is the password
    res.send(demoUser);

})

app.use("/listings", listingRoutes);  //executed for paths that start with /listings
app.use("/listings/:id/reviews", reviewRoutes);//executed for paths that start with /listings/:id/reviews   
// //parameter in parent route, therefore use mergeParams
app.use("/" , userRoutes);

app.all("*", (req,res,next) => {
    next(new expressError(404,"Page not Found")); //400: bad request
})

//Error handling middleware
app.use((err,req,res,next) => {
    let{statusCode = 500, message = "Something went wrong"} = err;  //The default values are assigned when statusCodes and mesage is undefined, They aren't overwritten
    res.status(statusCode).render("error.ejs", {message});
})

app.listen(port, () => {
    console.log(`server has started at ${port}`);
})

