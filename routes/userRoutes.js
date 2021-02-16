const express = require('express')
const router = express.Router()
const {requireAuth} = require('../middleware/authMiddleware')

// controllers
const userController = require('../controllers/userController')

// Get Blog and specific blog posts
// '/blogs/'


// add requireAuth back in 
router.get('/', requireAuth, userController.placeHolderFunction)
router.get('/:id', requireAuth, userController.placeHolderFunction)

// Add a comment to a blog
router.post('/:id', requireAuth, userController.placeHolderFunction)

module.exports = router