const http = require('http');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/user');

// mongoose.connect('mongodb://dbUser:anugraham@cluster0-shard-00-00-3j73h.mongodb.net:27017,cluster0-shard-00-01-3j73h.mongodb.net:27017,cluster0-shard-00-02-3j73h.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true  });
mongoose.connect('mongodb://localhost:27017/dbUser', {useNewUrlParser: true,useUnifiedTopology: true});
mongoose.Promise = global.Promise;;
mongoose.connection.on("error", error => {
    console.log('Problem connection to the database'+error);
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Allow-Control-Allow-Headers', 'Origin,X-Requested-with,Content-Type,Accept,Authorization ');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({})
    }
    next(); 

})
// User CRUD 
app.use('/user', userRoutes);
// Product
app.use('/product',userRoutes);
//Order task 
app.use('/order',userRoutes);
// app.use((req, res, next) => {
//     res.send("harirocks");
// });
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);

});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(3000);
