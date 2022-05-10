if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const methodOverride = require("method-override");
const Campground = require('./models/campground');
const ejsMate = require("ejs-mate");
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const userRouter = require('./routes/user');
const { isLoggedIn } = require('./middleware');
// const multer = require('multer');
// const { storage } = require('./cloudinary/index');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");




const mongoose = require('mongoose');
// https://blooming-basin-66422.herokuapp.com/
const dbUrl = process.env.Db_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('ejs', ejsMate);








const MongoStore = require('connect-mongo');
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


const sessionObject = {
    store: MongoStore.create({ mongoUrl: dbUrl, secret, touchAfter: 24 * 60 * 60 }),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}
app.use(session(sessionObject));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => { console.log(req.method, req.path); next(); })
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use(mongoSanitize());

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/users', userRouter);
app.use(helmet({ contentSecurityPolicy: false }));

app.get('/', (req, res) => {
    res.render('home')
})
app.all('*', (req, res, next) => {
    next(new ExpressError("NOT Found", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went wrong!";
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => { console.log(`listening on port : ${port}`); });