const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const { reviewSchema } = require('../schemas');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utilities/ExpressError');


module.exports.newReview = async (req, res, next) => {
    const { id } = req.params;
    const { reviewBody, rating } = req.body;
    const r = new Review({ reviewBody: reviewBody, rating: rating });
    r.author = req.user._id;
    await r.save();
    const campg = await Campground.findById(id);
    campg.review.push(r);
    await campg.save();
    req.flash('success', "Successfully posted the review!!");
    res.redirect(`/campgrounds/${id}`);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted the Review!!");
    res.redirect(`/campgrounds/${id}`);
}