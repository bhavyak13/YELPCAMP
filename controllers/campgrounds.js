const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const { campgroundSchema } = require('../schemas');
const Review = require('../models/review');
const flash = require('connect-flash');
const { isLoggedIn, isAuthor } = require('../middleware');
const User = require('../models/user');
const ExpressError = require('../utilities/ExpressError');
const { cloudinary } = require('../cloudinary')


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const obj = await Campground.find({});
    res.render('campgrounds/index', { obj });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const user = await User.findOne({ username: req.session.passport.user })
    const camp = new Campground(req.body);
    camp.author = user;
    for (let image of req.files) {
        const { path, filename } = image;
        let img = { url: path, filename: filename }
        camp.images.push(img);
    }
    const geoData = await geocodingClient.forwardGeocode({
        query: camp.location,
        limit: 1,
    }).send();
    camp.geometry = geoData.body.features[0].geometry;
    await camp.save();
    req.flash('success', "Successfully Created the Campground!!");
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res) => {
    const obj = await Campground.findById(req.params.id).populate({
        path: 'review',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!obj) {
        req.flash('error', 'Campground Not Found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { obj });
}

module.exports.renderEditForm = async (req, res) => {
    const campg = await Campground.findById(req.params.id);
    const obj = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { obj });
}

module.exports.updateCampground = async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body);
    let camp = await Campground.findById(req.params.id);
    for (let image of req.files) {
        const { path, filename } = image;
        let img = { url: path, filename: filename }
        camp.images.push(img);
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) { await cloudinary.uploader.destroy(filename); }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    const geoData = await geocodingClient.forwardGeocode({
        query: camp.location,
        limit: 1,
    }).send();
    camp.geometry = geoData.body.features[0].geometry;
    await camp.save();
    req.flash('success', 'Successfully Updated the Campground!!');
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campg = await Campground.findById(id);
    for (let i of campg.review) { await Review.findByIdAndDelete(i); }
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the Campground!!");
    res.redirect('/campgrounds');
}