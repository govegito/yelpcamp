var express=require("express");
var router=express.Router({mergeParams:true});

var Comments 		=require('../models/comments.js');
var Campground      =require('../models/campgrounds.js');

var middleware		=require('../middleware/index.js');


// NEW COMMENT 
router.get("/campgrounds/:id/comment/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,camps){
		if(err)
		{
			console.log(err);
		}
		else
		{
		res.render("newcomment.ejs",{camps:camps});
		}
	});
	
});

// POST THE NEWLY CREATED COMMENT

router.post("/campgrounds/:id/comment",function(req,res){
	Campground.findById(req.params.id,function(err,camps){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comments.create(req.body.Comments,function(err,comment){
				if(err){
					req.flash("error","something went wrong");
					console.log(err);
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					camps.Comments.push(comment);
					camps.save();
					req.flash("success","Comment posted");
					res.redirect("/campgrounds/" + camps._id);
				}
			})
		}
	})
});



// EDIT ROUTE

router.get("/campgrounds/:id/comment/:comment_id/edit",middleware.checkcommentownership, function(req, res){

	Campground.findById(req.params.id,function(err,camps){
		if(err)
		{
			console.log(err);
		}
		else
		{
			Comments.findById(req.params.comment_id,function(err,comment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				res.render("editcomment.ejs",{camps:camps , comment :comment});
			});
		}
	});
})


//UPDATE

router.put("/campgrounds/:id/comment/:comment_id",middleware.checkcommentownership, function(req , res){
	Comments.findByIdAndUpdate(req.params.comment_id, req.body.Comments, function(err,updatedcampground){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Comment editted");
			res.redirect("/campgrounds/" + req.params.id );
		}

	})

})

//delete route

router.delete("/campgrounds/:id/comment/:comment_id", middleware.checkcommentownership,function(req, res){
	Comments.findByIdAndRemove( req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Comment deleted");

			res.redirect("/campgrounds/" + req.params.id);
		}

	});
});

module.exports=router;