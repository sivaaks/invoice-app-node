const route= require('express').Router();
const service= require('../services/products.service');

route.post('/',service.addProduct);
route.put('/:id',service.updateProduct);
route.delete('/:id',service.deleteProduct);
route.get('/name',service.getProductIdByName);
route.get('/',service.getProducts);
route.get('/names',service.getProductsNameOnly);
route.get('/id/:id',service.getProductById);

module.exports= route;