const route= require('express').Router();
const service= require('../services/info.service');

route.get('/',service.getInfo);

module.exports= route;