const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');

exports.user_signUp = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(req.body);
            if (user.length >= 1 ) {
                return res.status(409).json({
                    message: 'mail exit'
                })
            } 
            
                console.log("signup new");
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    console.log(hash);
                    if (err) {
                        console.log("new signup error")
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        console.log("creating new user");
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created '
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            
        })
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'mail not found'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        message: "Auth failed"
                    });
                }
                if (result) {

                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 'secret', { expiresIn: 60 * 60 }

                    );
                    return res.status(200).json({
                        message: "Auth Successfull",
                        token: token
                    })
                }
                res.status(401).json({
                    message: "Auth failed"
                });


            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err

            });
        })
}


exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log("records deleted");
            res.status(200).json({
                Messaage: "User removed "
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_forget_password = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).exec()
        .then(result => {
            console.log(result);
            if (result === null) {
                return res.status(404).json({
                    message: "mail not found in the database"
                })
            }
            // console.log("data present");
            //   const user = new User();
            const token = crypto.randomBytes(3).toString('base64');
            // var motp = randomize('0',4);
            console.log(token);
            console.log(result);
            // user.reset_password_token = token;
            // User.update({ email: user.email }, { user });
            User.update({
                email: result.email
            }, {
                reset_password_token: token
            })
                .exec()
                .then(result => {
                    res.status(201).json({
                        message: "working"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
            // console.log(user);
            const transport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'hari.hk1994@gmail.com',
                    pass: 'anugraham'
                }
            });
            const mailOptions = {
                from: 'hari.hk1994@gmail.com',
                to: result.email,
                subject: 'Link to reset the password',
                text: 'Your token for rset token :' + token

            };
            transport.sendMail(mailOptions, (err, result) => {
                if (err) {
                    console.log("there was an error" + err);
                } else {
                    console.log('HERE IS THE RESPONSE:' + result);
                    res.status(200).json({
                        message: 'reset password successfull'
                    })
                }
            })
        })
}

exports.user_reset_password = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {
            User.findOneAndUpdate({
                $and: [{
                    reset_password_token: req.body.reset_password_token,
                    email: req.body.email
                }]
            },
                // reset_password_expires: Date.now() + 360000
                {
                    $set: {
                        password: hash
                    }
                })
                .exec()
                .then((result, err) => {
                    console.log(result)
                    if (result) {
                        res.send({
                            message: "password has been reset",
                            email: result.email
                        })
                    }
                    else {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    }
                }
                )
        }
    })
}




