const mongoose = require('mongoose')
const slugify = require('slugify')

const locationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true
        
    },
    price: {
        type: String,
        required: true
    },
    days: {
        type: String,
        required: true
    },
    nights: {
        type: String,
        required: true
    },
    image: {
        type: String,
        data: Buffer
    }
});

locationSchema.pre('validate', function(next) {
    console.log("pre validate:", this)
    if (this.title) {
       this.slug = slugify(this.title, {lower: true, strict: true})
    }

    next()
})

module.exports = mongoose.model('Location', locationSchema)