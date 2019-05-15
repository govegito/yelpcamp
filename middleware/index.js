var Campground      =require('../models/campgrounds.js');
var Comments 		=require('../models/comments.js');

var middleware={};




middleware.isLoggedIn = function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
    }
  req.flash("error", "please login first");
	res.redirect("/login");
}


//middle ware for authorization

middleware.checkcampownership= function checkuserownership(req,res,next){
	if(req.isAuthenticated()){
	
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
					req.flash("error", "you are not allowed to do that");
				}
			}

		})
	}
	else{
		req.flash("error","you need to be logged in to do that")
		res.redirect("back");
	}
}

middleware.checkcommentownership= function checkcommentuserownership(req,res,next){
	if(req.isAuthenticated()){
	
		Comments.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "you are not allowed to do that");
					res.redirect("back");
				}
			}

		})
	}
	else{
		req.flash("error","you need to be logged in to do that");
		res.redirect("back");
	}
}


module.exports= middleware;