const express = require('express');
const router = express.Router();

// import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth')
const { runValidation } = require('../validators')

// import from controllers
const { register, registerActivate, login, requireSignin } = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);

router.post('/login', userLoginValidator, runValidation, login);

router.post('/register/activate', registerActivate)

// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         data: 'This is secret page for logged in users only'
//     })
// })


module.exports = router;
