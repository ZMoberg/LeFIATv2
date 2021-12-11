const { date } = require('joi')
const mongoose = require('mongoose')
const slugify = require('slugify')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    image: {
        type: String,
        data: Buffer
    }
})

productSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    next()

})

module.exports = mongoose.model('Product', productSchema)