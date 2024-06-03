const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

// Middleware for logging
app.use(morgan('dev'));
app.use("/uploads",express.static('uploads'));
//mondodb connect

mongoose.connect('mongodb+srv://aravprajapati106:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop.baqei3r.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop')




// Middleware for parsing the data 
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    
    if (req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET,PATCH');
        return res.status(200).json({});
    }
    next();
    
});

// Routes which handle requests
app.use('/product', productRoutes);
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);

app.use("/", (req, res) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="API_doc.pdf"');

  // Read the PDF file from the filesystem
  const pdfFilePath = path.join(__dirname, "API_doc.pdf");
  const pdfFile = fs.createReadStream(pdfFilePath);

  // Pipe the PDF file to the response
  pdfFile.pipe(res);
});


// Error handling for routes not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    // res.json({error : error.message})
    // it will called the  next middleware function
    next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

// aravprajapati106
// edr6g5jTHPz16uqv
// mongodb+srv://aravprajapati106:<password>@node-rest-shop.baqei3r.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop