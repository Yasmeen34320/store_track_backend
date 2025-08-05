

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const path = require('path');   
mongoose.connect(process.env.URL);
const DBListener = mongoose.connection;

DBListener.on('error',(err)=>{console.log(err)})

const cors = require('cors');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());



const userRoute = require('./routes/userRoute');
const itemRoute = require('./routes/itemRoute')
const shopRoute = require('./routes/shopRoute');
const supplierRoute = require('./routes/supplierRoute');
const salesInvoiceRoute = require('./routes/salesInvoiceRoutes');
const salesDebtRoute = require('./routes/salesDebtRoutes');
DBListener.once('open',()=>{

    console.log("✅ Connected to MongoDB"); 
    app.get('/', (req, res) => {
        res.status(200).json({ message: "🎉 Backend is up and running!" });
    });

    app.use('/api/users',userRoute);
    app.use('/api/items',itemRoute);
    app.use('/api/shop',shopRoute);
    app.use('/api/suppliers' , supplierRoute);
    app.use('/api/salesDebt' , salesDebtRoute);
    app.use('/api/salesInvoice' , salesInvoiceRoute);
    

     app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

}); 
