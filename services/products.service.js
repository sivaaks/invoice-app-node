const db= require('../shared/db.connect');
const {ObjectId}= require('mongodb');
const {productValid,contactName} = require('../shared/validation');
const {getTokenDetails}=require('../shared/utils');

const services= {

   async addProduct(req,res){
       console.log('add customer called');
        try{
            const {error,value}= productValid.validate(req.body);
            if(error) return res.status(400).send({
                error:'Validation error',
                message:error.details[0].message,
            })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const product = await db.products.findOne({name:value.name,userId:_id});
            if(product) return res.status(400).send('Product already exists');
            const data= await db.products.insertOne({...value,userId:_id});
            return res.status(200).send('Product created');
        }catch(err){
            console.log(`Error adding ${err}`);
        }
    },

    async deleteProduct(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const id= req.params.id;
            const data= await db.products.deleteOne({_id:ObjectId(id),userId:_id});
            return res.status(200).send(data);
        }catch(err){
            console.log(`Error deleting product ${err}`);
        }
    },

    async updateProduct(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const {error,value}= productValid.validate(req.body);
            if(error) return res.status(400).send({
                error:'Va;idation failed',
                message:error.details[0].message,
            })
            const id= req.params.id;
            const isExists = await db.products.findOne({name:value.name,userId:_id});
            if(isExists._id!=id) return res.status(400).send('Product already exists');
            const data= await db.products.findOneAndUpdate({_id:ObjectId(id),userId:_id},{$set:value},{returnNewDocument:true});
            return res.status(200).send(data);
        } catch(err){
            console.log(`Error updating product ${err}`);
        }
    },

    async getProducts(req,res){
        const {user:{_id,email}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.products.find({userId:_id},{projection:{name:1,price:1,stock:1,tax:1,hsn:1}}).toArray();
            res.status(200).send(data);
        }catch(err){
            console.log(`Error getting product ${err}`);
        }
    },

    async getProductIdByName(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const {error,value}= contactName.validate(req.body);
            if(error) return res.status(400).send({
                error:'Validation error',
                message:error.details[0].message,
            })
            const data= await db.products.findOne({name:value.name,userId:_id},{projection:{_id:1}});
            res.status(200).send(data);
        }catch(err){
            console.log(`Error getting product name by id : ${err}`);
        }
    },

    async getProductsNameOnly(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.products.find({userId:_id},{projection:{_id:0,name:1}}).toArray();
            return res.status(200).send(data);
        }catch(err){
            console.log(`Error gettings product name only ${err}`);
        }
    },

    async getProductById(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.products.findOne({_id:ObjectId(req.params.id),userId:_id},{projection:{name:1,price:1,stock:1,hsn:1,tax:1}});
            res.status(200).send(data);
        }catch(err){
            console.log(`Error getting product by id : ${err}`);
        }
    },

}

module.exports= services;
