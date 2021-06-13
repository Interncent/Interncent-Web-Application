const mongoose = require('mongoose');
const notificationSChema = new mongoose.Schema({
	text: String,
	created: {
		type: Date,
		default: Date.now
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	link:String,
	isRead: {
		type: Boolean,
		default: false
	},
});

module.exports = mongoose.model('Notification', notificationSChema);
