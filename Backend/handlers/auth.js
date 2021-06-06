const db = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var mailOptionsImport = require('./mailOptions')

exports.signup = async function (req, res, next) {
  try {
    const notAuthorized = {
      status: 403,
      message: 'Your mail is not authorized for this role'
    }
    db.HiddenData.findById('600d38655a14e72e1cadc685')
      .then(async (data) => {
        switch (req.body.role) {
          case 'Faculty':
            if (data.facultyEmails.includes(req.body.email))
              break;
            else {
              return next(notAuthorized)
            }
          case 'Council':
            if (data.councilEmails.includes(req.body.email))
              break;
            else {
              return next(notAuthorized)
            }
          case 'Alumni':
            if (data.alumniEmails.includes(req.body.email))
              break;
            else {
              return next(notAuthorized)
            }
          case 'Student':
            if (req.body.email.split('@')[1] === 'somaiya.edu')
              break;
            else {
              return next(notAuthorized)
            }
          default:
            return next({
              status: '403',
              message: 'You are not allowed to login'
            })
        }
        req.body.emailToken = crypto.randomBytes(64).toString('hex');
        const newUser = await db.User.create(req.body);
        var mailOptions = mailOptionsImport(req, process);
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'kjsceintern@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return console.log(err.message);
          }
          console.log('Message Sent : %s', info.messageId);
          console.log('Preview URL : %s', info.getTestMessageURL(info));
        });
        return res.status(200).send('Signed Up Successfully')
      }).catch((err) => {
        return next(err)
      });

  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Sorry, that username/email is already taken.'
      // err.message = err.message;
    }
    return next({
      status: 400,
      message: err.message
    });
  }
}

exports.signin = async function (req, res, next) {
  try {
    let user = await db.User.findOne({
      email: req.body.email
    }).populate('events').populate('applications').populate('certificates').populate('experiences').populate('projects').populate('achievements').populate({ path: "internshipsOffered", populate: { path: 'applicants', select: 'fname lname email _id photo' } }).populate({ path: "internshipsOffered", populate: { path: 'recruited', select: 'fname lname email _id photo' } }).populate({ path: 'members', populate: { path: 'member', select: 'fname lname _id email photo' } }).populate({ path: 'commented', populate: { path: 'post', select: '_id image author', populate: { path: 'author', select: ' fname lname email' } } }).populate({ path: 'liked', populate: { path: 'post', select: '_id image author', populate: { path: 'author', select: 'email fname lname photo' } } }).exec()
    if (user.emailToken !== null) {
      return next({
        status: 401,
        message: 'Please verify your email first or try to Signup Again'
      })
    }
    let isMatch = await user.comparePassword(req.body.password, next);
    const { email, _id, fname, lname, emailToken } = user;
    if (isMatch) {
      let token = jwt.sign({
        email, _id, fname, lname, emailToken
      }, process.env.SECRET_KEY);

      return res.status(200).json({
        ...user._doc, token, password: ''
      })
    } else {
      next({
        status: 400,
        message: 'Invalid Email/Passowrd.'
      })
    }

  } catch (err) {
    return next(err);
  }

}
