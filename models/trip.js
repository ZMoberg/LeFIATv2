const mongoose = require('mongoose')
const slugify = require('slugify')

const tripSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    }
})

tripSchema.pre('validate', function(next) {
    if (this.title) {
       this.slug = slugify(this.title, {lower: true, strict: true})
    }

    next()
})

module.exports = mongoose.model('Trip', tripSchema)