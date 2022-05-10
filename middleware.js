const campground = require("./models/campground");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method == 'GET') {
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', 'Please Login First!');
        return res.redirect('/users/login')
    }
    next();
}
module.exports.isLoggedIn = isLoggedIn;


module.exports.isAuthor = async (req, res, next) => {
    const campg = await campground.findById(req.params.id);
    if (campg.author.equals(req.user._id)) return next();
    req.flash('error', "Author permissions required for that action!");
    res.redirect(`/campgrounds/${req.params.id}`);
}