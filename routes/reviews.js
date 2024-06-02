const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controllers/reviews.js');

// add a review
router.post('/',
    validateReview,
    isLoggedIn,
    catchAsync(review.addReview))

// delete a review
router.delete('/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(review.deleteReview))


module.exports = router;