const route = require('express').Router();
const service= require('../services/invoices.service');

route.post('/',service.addInvoice);
route.delete('/:id',service.deleteInvoice);
route.put('/:id',service.updateInvoice);
route.get('/',service.getInvoices);
route.get('/invoiceno/:no',service.getInvoiceByNo);
route.get('/no',service.getInvoiceNo);
route.get('/id/:id',service.getInvoiceById);
route.get('/type/:type',service.getInvoicesByType);
route.get('/calendar/all',service.getInvoicesByMonth);
route.put('/cancel/:id',service.cancelInvoice);

module.exports= route;
