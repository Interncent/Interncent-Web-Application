const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userScehma = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	emailToken: String,
	fname: {
		type: String,
	},
	lname: {
		type: String,

	},
	college: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'College'
	},
	dept: String,
	role: String,
	year: String,
	rollNo: {
		type: String
	},
	facultyId: String,
	photo: {
		type: String,
		default: 'https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg'
	},
	photoId: {
		type: String,
		default: '123z99'
	},
	created: {
		type: Date,
		default: Date.now
	},
	bookmarks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'InternshipDetails'
		}
	],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Notification'
		}
	],
	interactions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Interaction'
		}
	],
	resume: String,
	resumeDetails: {
		address: String,
		phoneNumber: String,
		email: String,
		careerObjectives: String,
		futureProspects: String,
		educationDetails: {
			graduation: {
				college: String,
				startYear: String,
				endYear: String,
				degree: String,
				stream: String,
				performance: String
			},
			twelth: {
				school: String,
				yearOfCompletion: String,
				board: String,
				stream: String,
				performance: String
			},
			tenth: {
				school: String,
				yearOfCompletion: String,
				board: String,
				stream: String,
				performance: String
			}
		}
	},
	internshipsOffered: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'InternshipDetails'
		}
	],
	applications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Application'
		}
	],

	skills: [
		{
			type: String
		}
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	liked: [
		{
			post: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
			created: {
				type: Date,
				default: Date.now
			}
		}
	],
	commented: [
		{
			post: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
			created: {
				type: Date,
				default: Date.now
			}
		}
	],
	certificates: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Certificate'
		}
	],
	achievements: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Achievement'
		}
	],
	experiences: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Experience'
		}
	],
	projects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project'
		}
	],
	bio: String,
	socialHandles: {
		facebook: {
			type: String,
			default: ''
		},
		twitter: {
			type: String,
			default: ''
		},
		linkedin: {
			type: String,
			default: ''
		},
		github: {
			type: String,
			default: ''
		},
	},
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
	}],
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CouncilMember',
		}
	],
	passwordResetToken: String,
	passedOut: String,
	workingAt: String,
	position: String



});

userScehma.methods.comparePassword = async function (password, next) {
	try {
		let isMatch = await bcrypt.compare(password, this.password);
		return isMatch;

	} catch (err) {
		return next(err);
	}
}

userScehma.pre('save', async function (next) {
	try {
		if (!this.isModified('password')) {
			return next();
		}
		let hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
		return next();

	} catch (err) {
		next(err);
	}
});
const User = mongoose.model('User', userScehma);
module.exports = User;