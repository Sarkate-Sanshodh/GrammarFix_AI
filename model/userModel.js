const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email: {
        type:String ,
        required : [true , "Please enter on emial"],
        unique:true,
        lowercase:true 
    },
    password:{
        type:String,
        required:[true , "Please enter a password"],
        minlength:[6 , 'Minimum password length is 6 characters'],
    }
})

userSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt();
    this.password  = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email , password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password , user.password);
        if(auth){
            return user ;
        }

        throw Error("incorrect password")
    }

    throw Error("incorrect email");
};

module.exports = mongoose.model('user' , userSchema); 
