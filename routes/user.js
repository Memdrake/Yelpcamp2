const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    // Render "register" page
    .get(users.registerPage)
    // Create a new user
    .post(catchAsync(users.createUser));


router.route('/login')
    // Render the login Page
    .get(users.loginPage)
    // Try to Log In
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.returnTo);

// Logout
router.get('/logout', users.logout);

module.exports = router;