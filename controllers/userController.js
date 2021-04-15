const blogModel = require('../models/blogPostsModel')


const placeHolderFunction = async (req, res) => {

    let blogPosts = await blogModel.find()

    console.log('placeholder firing');

    res.send(blogPosts)
}



module.exports = {placeHolderFunction}