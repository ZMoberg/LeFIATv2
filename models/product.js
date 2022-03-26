const { date, string } = require('joi')
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

    // create subcategories?

    price: {
        type: Number,
        required: true
    },
    sale: {
        type: String,
    },
    salePrice:{
        type: Number,
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
    },
    // subcategories ? 

    // create separate objects referencing parent?

    backpack: {
        type: String,
        volume: [{
            type: Number,
            id: String
        }],
        strapStyle: [{
            type: String,
            id: String
        }],
        packMaterial: [{
            type: String,
            id: String
        }],
        
    },
    sleep: {
        type: String,
        sleepStyle: [{
            type: String,
            id: String
        }],
        tempRating: [{
            type: String,
            id: String
        }],
        bagSize: [{
            type: String,
            id: String
        }],
        bagWidth: [{
            type: String,
            id: String
        }]
    },
    shelter: {
        type: String,
        shelterStyle: [{
            type: String,
            id: String
        }],
        sleepCapacity: [{
            type: String,
            id: String
        }],
  
    }
})

productSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    next()

})

module.exports = mongoose.model('Product', productSchema)