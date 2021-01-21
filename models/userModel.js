const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// intereacts with the model / database through set format
const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        required: true,
        default: false
    }
})

// hashes user password before it is saved
userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 10)
})

// login user - this is a thing
userSchema.statics.login = async function(email, password){
    // 'this' refers to the userModel
    const user = await this.findOne({email})

    if(user){
        // compare passwords
        const auth = await bcrypt.compare(password, user.password)

        // passwords match
        if(auth){
            return user
        }
        else{
            // error caught in controller function
            throw Error('incorrect password')
        }
    }

    else{
        // error caught in controller function
        throw Error('Incorrect username and password combination')
    }
}

module.exports = mongoose.model('user', userSchema)