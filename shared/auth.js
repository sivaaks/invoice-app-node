const jwt= require('jsonwebtoken');
const urlPattern=require('url-pattern');

const verifyPattern=new urlPattern('/users/verify(/:token)');

const services={

    authTokenCheck(req,res,next){
        console.log(req.path);
        if(req.path=='/users/login' || req.path=='/users/register' || verifyPattern.match(req.path)) return next();
        const loggedUser= jwt.decode(req.headers.auth);
        //console.log('loggedUser',loggedUser);
        //console.log(Date.now(),loggedUser.exp*1000);
        if(!loggedUser) return res.status(401).send('Login to continue');
        //Check token expiry
       // console.log(Date.now(),loggedUser.exp*1000);
        if(Date.now()>=loggedUser.exp*1000) return res.status(401).send('Login to continue');
        next();
        return loggedUser;
    },

    getLoggedInUser:{},

}

module.exports=services;