const express= require('express');
const cors=require('cors');
const db= require('./shared/db.connect');

const customersRoute= require('./routes/customers.route');
const invoicesRoute= require('./routes/invoices.route');
const productsRoute= require('./routes/products.route');
const infoRoutes=require('./routes/info.route');
const usersRoute=require('./routes/users.route');

const {authTokenCheck}=require('./shared/auth');

const {dbAddTime}=require('./shared/utils');

const app= express();
const PORT=3001;

(async()=>{
    try{
        await db.connect();

        app.use(cors({
            origin:['http://localhost:3000','https://siva-invoice-app.netlify.app']
        }))
        app.use(express.json());

        app.use(authTokenCheck);
        
        app.use('/users',usersRoute);
        app.use('/customers',customersRoute);
        app.use('/products',productsRoute);
        app.use('/invoices',invoicesRoute);
        app.use('/info',infoRoutes);
        
        app.listen(process.env.PORT||PORT);

    } catch(err){
        console.log(`Error: ${err}`);
    }
})();