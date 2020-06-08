const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        max: 32
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    },
    image: {
        url: String,
        key: String
    },
    content: {
        type: {},
        min: 20,
        max: 2000000
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)

