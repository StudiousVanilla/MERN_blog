const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },

    content:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        default: Date.now()
    },

    blogPostID:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('comment', commentSchema)