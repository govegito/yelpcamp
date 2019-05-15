var express 		=require('express');
var app 			=express();
var bodyparser		=require('body-parser');
var mongoose		=require('mongoose');
var seedDB			=require('./models/seed.js');
var Comments 		=require('./models/comments.js'),
	passport 		=require('passport'),
	methodOverride  =require('method-override'),
	LocalStrategy	=require('passport-local'),
	flash			=require('connect-flash'),
	User 			=require('./models/user.js');

var campgroundsroutes=require('./routes/campgrounds.js');
var commentsroutes=require('./routes/comments.js');
var indexroutes=require('./routes/index.js');


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
var Campground = require('./models/campgrounds.js');


//seeding the database
//seedDB();


app.use(bodyparser.urlencoded({extended:true}));
console.log("server is running");
app.use('/views/assets', express.static('views/assets'));


//Authentication configure

app.use(require("express-session")({
	secret: "anything",
	resave: false,
	saveUninitialized : false

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));
app.use(flash());

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error= req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use(campgroundsroutes);
app.use(commentsroutes);
app.use(indexroutes);



app.listen(3000, function(){
	console.log("okay");
});