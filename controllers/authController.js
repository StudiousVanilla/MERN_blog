require('dotenv').config()
const userModel = require('../models/userModel')
const {body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

// sets max age to 30 minutes (in seconds)
const maxAge = 30*60

// creating JWT
// when a new uses is being created 'id' is the user.id that is generated once a user is saved in the DB, this allows for an immediate JWT generate once a user signs-up - menaing they don't have to login.
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: maxAge})
}

// renders sign-up
module.exports.getSignUp = (req, res) => {
    res.send("sign up page")
}

// renders login
module.exports.getLogin = (req, res) => {
    // controller actions
    res.render('login');
}

// creates new user and assigns a JWT for instant login
module.exports.signUp =[

    // express validation of user inputted data
    body('name').trim().isLength({min: 1}).withMessage('Please enter a name'),
    body('name').trim().isLength({max: 70}).withMessage('Names cannot be longer than 70 characters'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('email').trim().isLength({max: 320}).withMessage('A valid email address cannot have more than 320 characters'),
    body('password').trim().isLength({min: 8}).withMessage('Passwords must be at least 8 characters long'),

    

    async (req, res) => {

        // grabs any errors from above validation
        const errors = validationResult(req)
        // if there are errors they are returned via json
        if(!errors.isEmpty()){
            return res.json(errors)
        }


        try {
            //  checks to see if an email address has already been registered
            const users = await userModel.find()
            const userCheck = users.find(user => user.email === req.body.email)

            // if email is already in user DB then error JSON sent
            if(userCheck){
                return res.json({error: "Email address already in use"})
            }

            // create a new user
            let user = new userModel({
                name: req.body.name,
                email: req.body.email,
                // password is hashed by model, using a sechema.pre frunction, before doc is saved to DB 
                password: req.body.password
            })
            try {
                // save user to database
                user = await user.save()

                // use newly saved user.id to generate a JWT
                const token = createToken(user.id)
                // add JWT to response cookies
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
                // send JSON user response (201 = created success)
                res.status(201).json({token: token})

            } catch (error) {
                // error sent as JSON
                res.json(error)
            }

        } catch (error) {
            // error sent as JSON
            res.json(error)
        }

    }
]

// compares email and passwords from database and assigns browser a JWT
module.exports.login = async (req, res) => {

    // get the user input from req body
    const {email, password}  = req.body

    try {

        // call login method from userModel to log user in
        // (finds user and compares password)
        const user = await userModel.login(email, password)

        // then generate a JWT if the user is found and password mathces
        const token = createToken(user.id)

        // add token to response cookies
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000, sameSite: false})

        // return status code and JSON user data
        res.status(201).json({user: user})
        
    } catch (error) {
        console.log(error.message);
        res.json({error: error.message})
    }
}

// resets JWT (to live for a millisecond) peventing access protected routes
module.exports.logout = (req, res) =>{
    res.locals.currentUser = null
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/login')
}