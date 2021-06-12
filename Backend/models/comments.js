const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	liked_by: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	replies: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

module.exports = mongoose.model('Comment', commentSchema);