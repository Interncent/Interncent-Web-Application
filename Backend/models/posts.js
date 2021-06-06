const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	content: String,
	image: String,
	imageId: String,
	created: {
		type: Date,
		default: Date.now
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	likedBy: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	hashtags:[
		{
			type:String
		}
	]
});

module.exports = mongoose.model('Post', postSchema);