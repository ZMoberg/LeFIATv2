if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')
const tripsRouter = require('./routes/trips')
const gearRouter = require('./routes/gear')
const aboutRouter = require('./routes/about')
const blogRouter = require('./routes/blog')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', error => console.error(error))
    db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/trips', tripsRouter)
app.use('/gear', gearRouter)
app.use('/about', aboutRouter)
app.use('/blog', blogRouter)


app.listen(process.env.PORT || 3000)