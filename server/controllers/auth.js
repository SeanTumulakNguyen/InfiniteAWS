const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams, forgotPasswordEmailParams } = require('../helpers/email');
const shortid = require('shortid');
const expressJwt = require('express-jwt');
const _ = require('lodash')

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});

const ses = new AWS.SES({
	apiVersion: '2010-12-01'
});

exports.register = (req, res) => {
	// console.log('REGISTER CONTROLLER', req.body)
	const { name, email, password } = req.body;

	// check if user exists in our db
	User.findOne({ email }).exec((err, user) => {
		if (user) {
			return res.status(400).json({
				error: 'Email is taken'
			});
		}
		// generate token with username email and password
		const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '1d' });

		//send email
		const params = registerEmailParams(email, token);

		const sendEmailOnRegister = ses.sendEmail(params).promise();

		sendEmailOnRegister
			.then((data) => {
				// console.log('Email submitted to SES', data);
				res.json({
					message: `Email has been sent to ${email}, Follow the instructions to complete your registration`
				});
			})
			.catch((err) => {
				// console.log('SES email on Register', err);
				res.json({
					message: `We could not verify your email. Please try again.`
				});
			});
	});
};

exports.registerActivate = (req, res) => {
	const { token } = req.body;
	// console.log(token);

	jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
		if (err) {
			// console.log(err)
			return res.status(401).json({
				error: 'Expired link. Try again'
			});
		}

		const { name, email, password } = jwt.decode(token);
		const username = shortid.generate();

		User.findOne({ email }).exec((err, user) => {
			if (user) {
				return res.status(401).json({
					error: 'Email is taken'
				});
			}

			// register new user
			const newUser = new User({ username, name, email, password });
			newUser.save((err, result) => {
				if (err) {
					return res.status(401).json({
						error: 'Error saving user in database. Try later'
					});
				}
				return res.json({
					message: 'Registration success. Please login.'
				});
			});
		});
	});
};

exports.login = (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User with that email does not exist. Please register.'
			});
		}
		// authenticate
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: 'Email and password do not match.'
			});
		}
		// generate token and send to client
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

		const { _id, name, email, role } = user;

		return res.json({
			token,
			user: { _id, name, email, role }
		});
	});
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET });

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findOne({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			// console.log(err)
			return res.status(400).json({
				error: 'User not found'
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findOne({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			// console.log(err)
			return res.status(400).json({
				error: 'User not found'
			});
		}
		if (user.role !== 'admin') {
			return res.status(400).json({
				error: 'Admin resource. Access denied'
			});
		}
		req.profile = user;
		next();
	});
};

exports.forgotPassword = (req, res) => {
	const { email } = req.body;
	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User with that email does not exist'
			});
		}
		const token = jwt.sign({ name: user.name }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

		const params = forgotPasswordEmailParams(email, token);

		// populate the database > user > resetPasswordLink
		return user.updateOne({ resetPasswordLink: token }, (err, success) => {
			if (err) {
				return res.status(400).json({
					error: 'Password reset failed. Try later'
				});
			}

			const sendEmail = ses.sendEmail(params).promise();
			sendEmail
				.then((data) => {
					// console.log('SES reset password success', data);
					return res.json({
						message: `Email has been sent to ${email}. Click on the link to reset your password`
					});
				})
				.catch((error) => {
					// console.log('SES reset password failed', error);
					return res.json({
						message: `We could not verify your email. Try later.`
					});
				});
		});
	});
};

exports.resetPassword = (req, res) => {
	const { resetPasswordLink, newPassword } = req.body;

	if (resetPasswordLink) {
		jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, success) => {
			if (err) {
				return res.status(400).json({
					error: 'Expired link. Try again'
				});
			}

			User.findOne({
				resetPasswordLink
			}).exec((err, user) => {
				if (err || !user) {
					return res.status(400).json({
						error: 'Invalid token. Try again'
					});
				}
				
				const updatedFields = {
					password: newPassword,
					resetPasswordLink: ''
				}

				user = _.extend(user, updatedFields)

				user.save((err, result) => {
					if (err) {
						return res.status(400).json({
							error: 'Password reset failed. Try again'
						});
					}

					res.json({
						message: `Great! Now you can login with your new password`
					})
				})
			});
		});
	}
};
