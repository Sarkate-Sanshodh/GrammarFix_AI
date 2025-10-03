const jwt = require('jsonwebtoken');
const User = require("../model/userModel");

const requireAuth = (req , res , next) =>{
    const token = req.cookies.token;
// check and jwt.verify token is exist or not 
    if(token){
        jwt.verify(token , process.env.JWT_SECRET , (err , decodedToken) =>{
            if(err){
                console.log(err.message);
                res.redirect("/login");   
            }else{
                next()
            }
        });
    }else{
         res.redirect('/login');
    }
};


const checkUser =  (req , res , next) =>{
    const token = req.cookies.token ;
    if(token){
        jwt.verify(token , process.env.JWT_SECRET , async (err , decodedToken)=>{
            if(err){
                res.locals.user = null ;
                next();
            }else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user ;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth  , checkUser}