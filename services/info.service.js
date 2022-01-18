const db= require('../shared/db.connect');
const {ObjectId} = require('mongodb');
const {getTokenDetails} = require('../shared/utils');

const infoServices={

    async getInfo(req,res){
        const {user:{_id}}=getTokenDetails(req.headers.auth);
        try{
            const data= await db.invoices.aggregate([
                { $match:{userId:_id}},
                {"$group" : {_id:"$type", count:{$sum:1}}}
            ]).sort({_id:1}).toArray();
            const customers= await db.customers.count({userId:_id});
            data.push({_id:'customers',count:customers});
            // data.map((event,index)=>{
            //    data[index]={...event,color:infoServices.getColor(event._id)}
            // })
            return res.status(200).send(data);
        }catch(err){
            console.log(`Get info error ${err}`);
        }
    },

    getColor(type){
        if (type==='appointment') return 'green'
        if (type==='event') return 'red'
        if (type==='meeting') return 'violet'
        if (type==='contact') return 'crimson'
    }

}

module.exports= infoServices;