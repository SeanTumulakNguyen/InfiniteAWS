const { check } = require('express-validator');

exports.categoryCreateValidator = [
	check('name').not().isEmpty().withMessage('Name is requred'),
	check('image').isEmpty().withMessage('Image is required'),
	check('content').isLength({ min: 20 }).withMessage('Content is required')
];

exports.categoryUpdateValidator = [
	check('name').not().isEmpty().withMessage('Name is requred'),
	check('content').isLength({ min: 20 }).withMessage('Content is required')
];
