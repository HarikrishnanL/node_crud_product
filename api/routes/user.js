// Necessary packages
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const async = require('async');
const crypto = require('crypto');
// const hbs = require('nodemailer-express-handlebars');
const email = "hari.hk1994@gmail.com";
const pass = "anugraham";
const nodemailer = require('nodemailer');
// Model Scehema 
const User = require('../model/usermodel');
const Product = require('../model/userproduct');
const Order = require('../model/userordermodel');
//check Auth is a middleware 
const checkAuth = require('../middleware/check_auth');
// project Controller
const userController = require('../Controllers/users');
const productController = require('../Controllers/products');
// Router for Userspecification
router.post('/signup', userController.user_signUp);
router.post('/login', userController.user_login);
router.post('/forget-password', userController.user_forget_password);
router.post('/reset-password', userController.user_reset_password);
router.delete('/:userId', userController.user_delete);
// End Router for Userspecification

//Router for productSpecification
router.get('/', productController.get_all_products);
router.post('/newproduct', checkAuth, productController.create_new_product);
router.get('/product_get_details', productController.get_single_product_details);
router.post('/product_update', checkAuth, productController.products_update);
//End Router For ProductSpecification

// Router for orderSpecification
router.get('/get_all', async (req, res, next) => {
    console.log("get all");
   
        const orderResponse = await Order.find();
        console.log(orderResponse);
        if (orderResponse) {
            console.log("inside the orderrespons");
            count = orderResponse.length;
            console.log(count);
            
            orderResponse.map(orderlist => {
                return {
                    order_id: orderlist.order_id,
                    order_quantity: orderlist.quantity,
                    product: orderlist.product,
                    price: orderlist.price,
                    user_id: orderlist._id
                }
                
            })
        
        console.log(orderResponse);
            res.status(200).json(orderResponse);
            
        }
    
    // catch (err) {
    //     console.log(err);
    //     res.status(500).json({
    //         error: err
    //     })
    // }
})
router.post('/newOrder', async (req, res, next) => {
    console.log("inside new order");
    try {
        const product = await Product.findOne({ $or: [{ productName: req.body.productName }, { product_id: req.body.product_id }] });
        console.log(product);
       
            console.log("if loop then ");
            console.log(req.body);
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product:product,
                user:req.body.user,
                quantity:req.body.quantity  
            });
            // const orderResponse={
            //     orderRecords:order,
            //     product:order.product
            // }
            // console.log(orderResponse);
            const report= await order.save();   
            console.log(report);
        
        res.status(200).json({
            message:"order successfully created",
             orders:report
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})
// End Router orderSpecification





module.exports = router;