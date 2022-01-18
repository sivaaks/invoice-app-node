const db= require('../shared/db.connect');
const {ObjectId}= require('mongodb');
const {customerValid,contactName} = require('../shared/validation');
const {getTokenDetails}=require('../shared/utils');

const services= {

   async addCustomer(req,res){
       console.log('add customer called');
        try{
            const {error,value}= customerValid.validate(req.body);
            if(error) return res.status(400).send({
                error:'Validation error',
                message:error.details[0].message,
            })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const {name,email,phone}= value;
            const customer = await db.customers.findOne({$or:[{name},{email},{phone}],userId:_id});
            if(customer) return res.status(400).send('Customer already exists');
            const data= await db.customers.insertOne({...value,userId:_id});
            return res.status(200).send('Customer created');
        }catch(err){
            console.log(`Error adding ${err}`);
        }
    },

    async deleteCustomer(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const id= req.params.id;
            const data= await db.customers.deleteOne({_id:ObjectId(id),userId:_id});
            return res.status(200).send(data);
        }catch(err){
            console.log(`Error deleting customer ${err}`);
        }
    },

    async updateCustomer(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const {error,value}= customerValid.validate(req.body);
            if(error) return res.status(400).send({
                error:'Va;idation failed',
                message:error.details[0].message,
            })
            const id= req.params.id;
            const {name,email,phone}= value;
            const isExists = await db.customers.findOne({$or:[{name},{email},{phone}],userId:_id});
            if(isExists._id!=id) return res.status(400).send('Customer already exists');
            const data= await db.customers.findOneAndUpdate({_id:ObjectId(id),userId:_id},{$set:value},{returnNewDocument:true});
            return res.status(200).send(data);
        } catch(err){
            console.log(`Error updating customer ${err}`);
        }
    },

    async getCustomers(req,res){
        const {user:{_id,email}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.customers.find({userId:_id},{projection:{name:1,email:1,phone:1,address:1,state:1}}).toArray();
            res.status(200).send(data);
        }catch(err){
            console.log(`Error getting customer ${err}`);
        }
    },

    async getCustomerIdByName(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const {error,value}= contactName.validate(req.body);
            if(error) return res.status(400).send({
                error:'Validation error',
                message:error.details[0].message,
            })
            const data= await db.customers.findOne({name:value.name,userId:_id},{projection:{_id:1}});
            res.status(200).send(data);
        }catch(err){
            console.log(`Error getting customer name by id : ${err}`);
        }
    },

    async getCustomersNameOnly(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.customers.find({userId:_id},{projection:{_id:0,name:1}}).toArray();
            return res.status(200).send(data);
        }catch(err){
            console.log(`Error gettings customer name only ${err}`);
        }
    },

    async getCustomerById(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.customers.findOne({_id:ObjectId(req.params.id),userId:_id},{projection:{name:1,email:1,phone:1,state:1,address:1}});
            res.status(200).send(data);
        }catch(err){
            console.log(`Error getting customer by id : ${err}`);
        }
    },

}

module.exports= services;
