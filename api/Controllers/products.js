const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../model/userproduct');
const User = require('../model/usermodel');
// const checkAuth = require('../middleware/check_auth');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .exec()
        .then(productList => {
            const response = {
                count: productList.length,
                product: productList.map(list => {
                    return {
                        product_id: list.product_id,
                        productName: list.productName,
                        price: list.price,
                        description: list.description,
                        user: list.user

                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            })
        });
}

exports.create_new_product = (req, res, next) => {
    Product.findOne({ productName: req.body.productName })
        .exec()
        .then(result => {
            if (result !== null) {
                res.status(409).json({
                    message: "Product already existed in the database"
                })
            }
            else {
                const product = new Product({
                    product_id: new mongoose.Types.ObjectId(),
                    productName: req.body.productName,
                    price: req.body.price,
                    description: req.body.description,
                    user: req.body.user
                });
                product.save()
                    .then(records => {
                        res.status(201).json({
                            message: "New product Created",
                            record: records

                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(406).json({
                            error: err
                        })
                    })
            }
        })
}

exports.get_single_product_details= (req, res, next) => {
    Product.findOne({ $or: [{ product_id: req.body.product_id }, { productName: req.body.productName }] })
        .populate('user', 'email firstName lastName')
        .exec()
        .then(records => {
            if (records) {
                res.status(200).json({
                    product: records

                });
            }
            else {
                res.status(404).json({
                    message: "No Such Product Found in the database"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.products_update=(req, res, next) => {
    Product.findOneAndUpdate({ $and: [{ productName: req.body.productName }, { product_id: req.body.product_id }] },
        { $set: { price: req.body.price } }
    )
        .exec()
        .then(result => {
            res.status(200).json({
                message: "price updated",
                product: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

}
