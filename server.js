if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const catchAsync = require('./utils/catchAsync')
const expressLayouts = require('express-ejs-layouts')
const ExpressError = require('./utils/ExpressError');

const ejsRender = require("./utils/ejsRender");


const indexRouter = require('./routes/index')
const tripsRouter = require('./routes/trips')
const gearRouter = require('./routes/gear')
const aboutRouter = require('./routes/about')
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/users')

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const MongoDBStore = require('connect-mongo')(session)


mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', error => console.error(error))
    db.once('open', () => console.log('Connected to Mongoose'))

    const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:3000/lefiatv2'

    const store = new MongoDBStore({
        url: dbUrl,
        secret,
        touchAfter: 24 * 60 * 60
    });
    
    store.on('error', function (e) {
        console.log('session store error', e)
    })
    
    const sessionConfig = {
        store,
        name: 'session',
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }


app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next ) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    console.log(res.locals.currentUser)
    next()
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
    
app.use('/', indexRouter)
app.use('/trips', tripsRouter)
app.use('/gear', gearRouter)
app.use('/about', aboutRouter)
app.use('/blog', blogRouter)
app.use('/', userRouter)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Something went wrong";
    ejsRender(req, res, "error", { err });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})