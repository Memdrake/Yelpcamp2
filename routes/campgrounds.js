const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// get -> shows all campgrounds || post -> create a campground /POST request
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(campgrounds.createNew));


// renders "new campground"  page
router.get('/new',
    isLoggedIn,
    campgrounds.new);

router.route('/:id')
    // show page
    .get(catchAsync(campgrounds.showPage))
    // update with /PUT request
    .put(isLoggedIn,
        isAuthor,
        upload.array('image'),
        validateCampground,
        catchAsync(campgrounds.update))

    // delete a campground
    .delete(isLoggedIn,
        isAuthor,
        catchAsync(campgrounds.delete));

// renders "edit campground" page
router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.editCampground));

module.exports = router;