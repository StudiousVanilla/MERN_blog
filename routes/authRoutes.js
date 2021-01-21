const express = require('express')
const router = express.Router()

// controllers
const authController = require('../controllers/authController')

// signup routes
router.get('/signup', authController.getSignUp)
router.post('/signup', authController.signUp)

// login routes
router.get('/login', authController.getLogin)
router.post('/login', authController.login)

// logout routes
router.post('/logout', authController.logout)

// requireAuth somewhere ********** needds to be added

module.exports = router