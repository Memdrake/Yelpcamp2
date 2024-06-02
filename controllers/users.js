const User = require('../models/user');

// Render "register" page
module.exports.registerPage = (req, res) => {
    res.render('users/register');
}


// Create a new user
module.exports.createUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }


}


// Render the login Page
module.exports.loginPage = (req, res) => {
    res.render('users/login')
}

// Try to Log In
module.exports.returnTo = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// Logout
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    });
}