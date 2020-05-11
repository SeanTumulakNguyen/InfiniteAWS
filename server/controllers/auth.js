const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email');

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
		const params = registerEmailParams(email, token).promise();

		const sendEmailOnRegister = ses.sendEmail(params).promise();

		sendEmailOnRegister
			.then((data) => {
				console.log('Email submitted to SES', data);
				res.send('Email sent');
			})
			.catch((err) => {
				console.log('SES email on Register', err);
				res.send('Email failed');
			});
	});
};
