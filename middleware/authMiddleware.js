require('dotenv').config()
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')


// verifies JWT token to give users access to specific pages
const requireAuth = (req, res, next) =>{
    
    // grab the token from the request object
    const token = req.cookies.jwt

    if(token){
        // verifes token using .env secret
        jwt.verify(token, process.env.JWT_SECRET, (err)=>{

            // if there is an error during verification
            if(err){
                console.log('requireAuth - Error message:');
                console.log(err.message);
                res.redirect('/login')
            }
            // if token is successfully verified then the next middleware is called
            else{
                next();
            }
        })
    }
    // if there is no token
    else{
        console.log('requireAuth - No token');
        res.redirect('/login')
    }
}


// checks if there is a current user logged in
const checkUser = (req, res, next) =>{

    // grabs JWT (if it exists)
    const token = req.cookies.jwt

    if(token){

        // verifies token based on secret from .env 
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {

            // if token does not exist, or cannot be verifed, then the current user is set to null
            if(err){
                console.log(err.message);
                res.locals.currentUser = null
                next();
            }
            else{
                try {
                    // user is found in the database using data from the JWT
                    const user = await userModel.findById(decodedToken.id)

                    // current user is set to this user retrieved from the database
                    res.locals.currentUser = user
                    next();
                
                // if there is an error finding the user the current user is set to null
                } catch (error) {
                    res.locals.currentUser = null
                    console.log(error);
                    next();
                }
            }
        })
    }
    // if there is no token
    else{
        console.log('checkUser - No token');
        next();
    }
}

module.exports = {checkUser, requireAuth}