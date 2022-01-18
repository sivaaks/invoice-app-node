const db=require('../shared/db.connect');
const {addInvoice,deleteInvoice,updateInvoice,getInvoicesByType}=require('../shared/validation');
const {dateTime,getTokenDetails} = require('../shared/utils');
const {ObjectId}= require('mongodb');

const events={

    async addInvoice(req,res){

        try{
            //validate data
            const {error,value}= addInvoice.validate(req.body);
            if(error) return res.status(400).send({
                error:'Validation failed',
                message:error.details[0].message,
            })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            //check if same invoice no exists
            const invoice= await db.invoices.find({no:value.no,userId:_id}).toArray();
            if(invoice.length>0) return res.status(200).send('An invoice already exists in the same no');
            else {
               const data= await db.invoices.insertOne({...value,createdAt:dateTime,userId:_id});
               return res.status(200).send(data);
            }
        }catch(err){
            console.log(`Add invoice error ${err}`);
        }
    },

    async deleteInvoice(req,res){
        try{
            const {error,value}= deleteInvoice.validate({id:req.params.id});
            if(error) return res.status(400).send({
                error:'Validation failed',
                message:error.details[0].message,
            })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const data= await db.invoices.deleteOne({_id:ObjectId(value.id),userId:_id});
            res.status(200).send(data);
        }catch(err){
            console.log(err);
        }
    },

   async updateInvoice(req,res){
        try{
            const id= req.params.id;
            const {error,value}= updateInvoice.validate(req.body);
            if(error) return res.status(400).send({
                error:'Validation failed',
                message:error.details[0].message,
            })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const data= await db.invoices.findOneAndUpdate({_id:ObjectId(id),userId:_id},{$set:{...value}});
            return res.status(200).send(data);
        }catch(err){
            console.log(`Error updating ${err}`);
        }
    },

    async getInvoices(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const invoices= await db.invoices.find({userId:_id}).toArray();
            return res.status(200).send(invoices);
        }catch(err){ 
            console.log(`Error getting invoices ${err}`);
        }
    },

    async getInvoiceByNo(req,res){
        console.log('invoice by no called');
        const invoiceNo=req.params.no;
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        console.log(invoiceNo,_id);
        try{
            const invoices= await db.invoices.findOne({no:parseInt(invoiceNo),userId:_id});
            console.log('invoices',invoices);
            return res.status(200).send(invoices);
        }catch(err){ 
            console.log(`Error getting events ${err}`);
        }
    },

    async getInvoiceById(req,res){
        console.log('get invoice by Id called');
        const id=req.params.id;
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        console.log(id);
        try{
            const invoices= await db.invoices.findOne({_id:ObjectId(id),userId:_id},{_id:0,userId:0});
            console.log('invoices',invoices);
            return res.status(200).send(invoices);
        }catch(err){ 
            console.log(`Error getting events ${err}`);
        }
    },

   async getInvoicesByType(req,res){
        try{
            const {error,value}= getInvoicesByType.validate({type:req.params.type});
            if(error) return res.status(400).send({
                error:'Validation error',
                message:error.details[0].message,
                })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const data= await db.invoices.find({type:value.type,userId:_id}).sort({date:1}).toArray();
            return res.status(200).send(data);
        }catch(err){
            console.log(`Get events by type error: ${err}`);
        }
    },

    async getInvoicesByMonth(req,res){
        try{
            // const {error,value}= getEventsByType.validate({type:req.params.type});
            // if(error) return res.status(400).send({
            //     error:'Validation error',
            //     message:error.details[0].message,
            //     })
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const data= await db.invoices.find({userId:_id}).sort({date:1}).toArray();
            return res.status(200).send(data);
        }catch(err){
            console.log(`Get events by type error: ${err}`);
        }
    },

    async statusUpdate(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data=await db.invoices.findOneAndUpdate({_id:ObjectId(req.query.id),userId:_id},{$set:{status:req.query.status}});
            console.log(data);
            return res.status(200).send('Updated event status');
        }catch(err){
            console.log(`Error updating event status ${err}`);
        }
    },

    async cancelInvoice(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data=await db.invoices.findOneAndUpdate({_id:ObjectId(req.params.id),userId:_id},{$set:{status:'Cancelled'}});
            console.log(data);
            return res.status(200).send('Cancel invoice');
        }catch(err){
            console.log(`Error cancelling invoice ${err}`);
        }
    },

    async getInvoiceNo(req,res){
        try{
            const {user:{_id}}=getTokenDetails(req.headers.auth);
            const data= await db.invoices.find({userId:_id}).sort({no:-1}).limit(1).toArray();
            console.log(data);
            return res.status(200).send(data);
        }catch(err){
            console.log(`Get events by type error: ${err}`);
        }
    },

}

module.exports= events;