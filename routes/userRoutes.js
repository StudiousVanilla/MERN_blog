const express = require('express')
const router = express.Router()

// controllers
const userController = require('../controllers/userController')

// Get Blog and specific blog posts
router.get('/', userController.placeHolderFunction)
router.get('/:id', userController.placeHolderFunction)

// Add a comment to a blog
router.post('/:id', userController.placeHolderFunction)

module.exports = router