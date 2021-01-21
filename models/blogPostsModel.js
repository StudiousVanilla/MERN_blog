const mongoose = require('mongoose')

const blogPostSchema = new mongoose.Schema({

    title:{
        type: String,
        required:true
    },

    content:{
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    },

    posted: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('post', blogPostSchema)