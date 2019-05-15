var express=require("express");
var router=express.Router();

var Campground      =require('../models/campgrounds.js');
var Comments 		=require('../models/comments.js');
var middleware		=require('../middleware/index.js');

//Campgrounds page route

router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,Camps){
    	if(err)
    	{
    		console.log(err);
    	}
    	else
    	{
    		res.render("campgrounds.ejs",{camps:Camps});
    	}
    })
});


//Adding a new campground POST route
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name= req.body.name;
    var image=req.body.img;
	var desc = req.body.desc;
	var author={
		id: req.user._id,
		username: req.user.username
	}

    var newcamp={name: name, img:image, desc: desc,author: author};
    Campground.create(newcamp,function(err,resp){
    	if(err)
    	{
			req.flash("error", "something went wrong");
    		console.log(err);
    	}
    	else
    	{
			
    		console.log("added to db");
    	}
    });
	req.flash("success" ,"Campground added");
    res.redirect("/campgrounds");
});

// New campground route
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("newcampgrounds.ejs");
})


//show route
router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("Comments").exec(function(err,camps){
		if(err){
			console.log(err)
		}
		else{
			console.log(camps);
			res.render("show.ejs",{camps:camps})
		}

	});
});

//edit campgrounds route
router.get("/campgrounds/:id/edit",middleware.checkcampownership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds.edit.ejs",{Campground: foundCampground});
		}
	});
});

//update route

router.put("/campgrounds/:id",middleware.checkcampownership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.Campground, function(err,updatedcampground){
		if(err){
			req.flash("error", "something went wrong");
			res.redirect("/campgrounds");
		}
		else{
			req.flash("success","Campground Editted ")
			res.redirect("/campgrounds/" + req.params.id);

		}
	});
});

//Destroy route

router.delete("/campgrounds/:id",middleware.checkcampownership,function(req,res){
	Campground.findByIdAndRemove( req.params.id, function(err){
		if(err)
		{
			console.log(err);
		}
		else{
			req.flash("success","Campground deleted");
			res.redirect("/campgrounds");
		}
	});
});


module.exports=router;