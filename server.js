if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path');

const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const expressLayouts = require('express-ejs-layouts')
const ExpressError = require('./utils/ExpressError');


const indexRouter = require('./routes/index')
const tripsRouter = require('./routes/trips')
const gearRouter = require('./routes/gear')
const aboutRouter = require('./routes/about')
const blogRouter = require('./routes/blog')
const usersRouter = require('./routes/users')



const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const MongoDBStore = require('connect-mongo')(session)

const mongoose = require('mongoose')
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
            // secure: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }

    



mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
    
    app.use(session(sessionConfig));
    app.use(flash());
    app.use(helmet());

    const scriptSrcUrls = [
        "https://stackpath.bootstrapcdn.com/",
        "https://kit.fontawesome.com/",
        "https://cdnjs.cloudflare.com/",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com/swiper@7/swiper-bundle.min.css",
    ];
    const styleSrcUrls = [
        "https://kit-free.fontawesome.com/",
        "https://stackpath.bootstrapcdn.com/",
        "https://use.fontawesome.com/",
        "https://unpkg.com/swiper@7/swiper-bundle.min.css"
        
    ];
  
    const fontSrcUrls = [];
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/zmoberg/", 
                    "https://images.unsplash.com/",
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    })
    

app.use('/', indexRouter)
app.use('/trips', tripsRouter)
app.use('/gear', gearRouter)
app.use('/about', aboutRouter)
app.use('/blog', blogRouter)
app.use('/users', usersRouter)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})