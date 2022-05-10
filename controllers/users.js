const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');


module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const u = new User({ username: username, email: email })
        await User.register(u, password);
        req.login(u, e => { if (e) return next(e); });
        req.flash('success', `Welcome to Yelp-Camp! ${username}`);

        let x = '/campgrounds';
        if (req.session.returnTo) { x = req.session.returnTo }
        delete req.session.returnTo;
        res.redirect(x);
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}

module.exports.renderRegister = (req, res) => {
    res.render('users/new');
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.login = async (req, res) => {
    req.flash('success', 'Welccome back!')
    let x = '/campgrounds';
    if (req.session.returnTo) { x = req.session.returnTo }
    delete req.session.returnTo;
    res.redirect(x);
}
module.exports.signout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye!!');
    res.redirect('/');
}