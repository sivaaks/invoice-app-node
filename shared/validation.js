const Joi = require('joi');

const validate = {
    registerUser: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(16).required(),
        phone: Joi.optional(),
        type: Joi.string().required(),
    }),
    loginUser: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(16).required(),
    }),
    forgotPassword: Joi.object({
        email: Joi.string().email().required(),
    }),
    passwordReset: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(16).required(),

    }),
    addInvoice: Joi.object({
        no:Joi.number().required(),
        date: Joi.string().required(),
        customer: Joi.string().required(),
        products:Joi.required(),
        subtotal: Joi.number().required(),
        tax: Joi.required(),
        total: Joi.number().required(),
        type:Joi.optional(),
    }),
    deleteInvoice: Joi.object({
        id: Joi.string().min(24).max(24).required(),
    }),
    updateInvoice: Joi.object({
        no:Joi.required(),
        date: Joi.string().required(),
        customer: Joi.string().required(),
        products:Joi.required(),
        subtotal: Joi.number().required(),
        tax: Joi.required(),
        total: Joi.required(),
        type:Joi.string().required(),
    }),
    getInvoicesByType: Joi.object({
        type: Joi.string().min(5).required(),
    }),
    customerValid: Joi.object({
        name: Joi.string().required(),
        phone: Joi.optional(),
        email: Joi.string().email().optional(),
        address: Joi.string().optional(),
        state: Joi.string().required(),
    }),
    productValid: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().optional(),
        tax: Joi.number().optional(),
        hsn: Joi.optional(),
        stock: Joi.number().required(),
    }),
    contactName: Joi.object({
        name: Joi.string().min(1).required(),
    }),
    personalDiary: Joi.object({
        date: Joi.string().required(),
        content: Joi.string().min(10).max(255).required(),
    })
}

module.exports = validate;