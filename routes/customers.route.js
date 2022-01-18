const route= require('express').Router();
const service= require('../services/cutomers.service');

route.post('/',service.addCustomer);
route.put('/:id',service.updateCustomer);
route.delete('/:id',service.deleteCustomer);
route.get('/name',service.getCustomerIdByName);
route.get('/',service.getCustomers);
route.get('/names',service.getCustomersNameOnly);
route.get('/id/:id',service.getCustomerById);

module.exports= route;