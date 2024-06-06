//VVVV allow us to use the ENV files
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const helmet = require('helmet');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//VVVV allows to use ejs files
const ejsMate = require('ejs-mate');
//VVVV lets us have cookie sessions
const session = require('express-session');
//VVVV package for info popups
const flash = require('connect-flash');
//VVVV error handling via express
const expressError = require('./utils/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const reviewsRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds');
//VVVV used to avoid mongo injection
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo');

//mongodb://localhost:27017/yelp-camp
//VVVV connects us with our database
//     in case of error displays connection error and the error, in case of success, it connects with the db and display database connected
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database connected');
});
//VVVV allows us to use express
const app = express();
//VVVV allow us to use ejs as an engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//VVVV uses hte mongo sanitize and if there is an attempt of a querry injection, it replaces it with _
app.use(mongoSanitize());
//VVVV protects our headers
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: true
}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doluxrdqp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function(e) {
    console.log("session store error", e)
})
//VVVV builds up our session and cookies
const sessionConfig = {
    //VVV this is the cookie name we are looking for
    store,
    name: 'njnasdfn',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //VV this cookies should only work with HTTPS and not just HTTP
       // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//_________________________________________________
//VVVV authentication and authorization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//VVVV its used for the info popups in case of success or error
app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//VVVV simplified routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);



//VVVV renders the home page
app.get('/', (req, res) => {
    res.render('home')
});


//VVVV renders an error page with the code 404 if no page is found
app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404));
})

//VVVV displays any error available
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('errors', { err })
})


//VVVV port that the app is serving
app.listen(3000, () => {
    console.log('Serving on port 3000');
})