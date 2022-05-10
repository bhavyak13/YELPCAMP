const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const { reviewSchema } = require('../schemas');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utilities/ExpressError');
const reviews = require('../controllers/reviews');

const isAuthorReview = async (req, res, next) => {
    const r = await Review.findById(req.params.reviewId).populate('author');
    if (r.author._id.equals(req.user._id)) return next();
    req.flash('error', 'You dont have permissions to do that!');
    res.redirect(`/campgrounds/${req.params.id}`);
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.newReview))

router.delete('/:reviewId', isLoggedIn, isAuthorReview, catchAsync(reviews.deleteReview))

module.exports = router;