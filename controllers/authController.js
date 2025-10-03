const User = require("../model/userModel");
const jwt  = require("jsonwebtoken");


// /create token 
const maxAge = 3*24*60*60 ;  // within 3 days expire this token
const createToken = (id) =>{
    return jwt.sign({ id } , process.env.JWT_SECRET,{
       expiresIn :maxAge
    });
};


// create Routes
module.exports.signup_get = (req , res) => {
    res.render('signup');
}

module.exports.login_get = (req , res)=>{
    res.render('login')
}
module.exports.signup_post = async (req , res) => {
    const {email , password , username} = req.body;
    try{
        const user = await User.create({username , email , password});
        const token = createToken(user._id);
        res.cookie("token" , token , {httpOnly: true, maxAge : maxAge * 1000});
        res.status(201).json({user: user._id})

    }
   catch(err) {
    res.send(err)
    // const errors = handleErrors(err);
    // res.status(400).json({ errors });
  }
}

module.exports.login_post = async(req ,res)=>{
    try{

        const {email , password} = req.body;
        const user = await User.login(email , password) ;
        const token = createToken(user._id);
        res.cookie("token" , token , { httpOnly: true, maxAge: maxAge * 1000 }) ;
        res.status(200).json({ user: user._id })
    }
    catch(err){
        const errors = {email : '' , password: ''};
        if(err.message == "incorrect email"){
            errors.email ='that email is not registered';
        }

        if(err.message == "incorrect password"){
            errors.password = 'that password is not correct';
        }

        res.status(400).json({ errors });
    }

}

module.exports.logout_get = (req , res)=>{
    res.cookie("token" , " " , {maxAge:1});
    res.redirect("/")
}