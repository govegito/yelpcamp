var mongoose=require('mongoose');


var campSchema = new mongoose.Schema({
	name: String,
	img:  String,
	desc: String,
	author  : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
	Comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Comments"
		}
	]
});

module.exports = mongoose.model("Campground",campSchema);