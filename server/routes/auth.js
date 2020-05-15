const express = require('express');
const router = express.Router();

// import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth')
const { runValidation } = require('../validators')

// import from controllers
const { register, registerActivate, login } = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);

router.post('/login', userLoginValidator, runValidation, login);

router.post('/register/activate', registerActivate)


module.exports = router;
