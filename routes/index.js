
var express=require("express");
var router=express.Router();

var User 			=require('../models/user.js');
var passport 		=require('passport');


router.get("/",function(req,res){
    res.render("landing.ejs");
 });


 // register
 router.get("/register",function(req,res){
	res.render("register.ejs");
});

router.post("/register",function(req,res){
	var Newuser= new User({username: req.body.username});
	User.register(Newuser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","welcome to yelpcamp, " + user.username)
			res.redirect("/campgrounds")
		})
	})
});

//login

router.get("/login",function(req,res){
	res.render("login.ejs");
	
});

router.post("/login",passport.authenticate("local",{
	successRedirect : "/campgrounds",
	failureRedirect: "/login",

}),function(req,res){});


//logout

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success", "you have been logged out")
	res.redirect("/campgrounds");
});

//middleware

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports=router;