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
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        String,
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