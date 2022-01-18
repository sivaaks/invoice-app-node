const route= require('express').Router();

const service= require('../services/users.service');

route.post('/register',service.registerUser);
route.post('/login',service.loginUser);
route.post('/forgot-password',service.forgotPassword);
route.get('/verify/:token',service.verifyUser);
route.get('/reset-password/:token',service.resetPassword);

module.exports= route;