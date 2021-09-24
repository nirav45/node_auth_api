const db = require('../conn');
const User = db.users;
const authConfig = require("../config/auth");
const constant = require("../config/constant");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.register = (req, res) => {
    let reqData = req.body;
    if (!reqData.email) {
        res.status(401).send({
            status: false,
            data: {
                message: constant.emailRequire
            }
        });
        return
    }
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!regex.test(reqData.password)) {
        res.status(401).send({
            status: false,
            data: {
                message: constant.invalidPassword
            }
        });
        return
    }

    User.create({
        email: reqData.email,
        password: bcrypt.hashSync(reqData.password, 8),
        type: constant.userType.User
    }).then((user) => {
        if (user) {
            let token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: 86400 // 24 hours
            });
            delete user.password;
            res.status(200).send({
                status: true,
                data: {
                    user: user,
                    authToken: token,
                    message: constant.userRegister
                }
            });
            return
        }

    }).catch(err => {
        res.status(401).send({
            status: false,
            data: {
                message: constant.serverError
            }
        });
        return
    });
};

exports.login = (req, res) => {
    let reqData = req.body;
    if (!reqData.email) {
        res.status(401).send({
            status: false,
            data: {
                message: constant.emailRequire
            }
        });
        return
    }
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!regex.test(reqData.password)) {
        res.status(401).send({
            status: false,
            data: {
                message: constant.invalidPassword
            }
        });
        return
    }

    User.findOne({
        where: {
            email: reqData.email
        }
    }).then(user => {
        let passwordIsValid = bcrypt.compareSync(
            reqData.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                status: false,
                message: "Invalid Password!"
            });
        }

        let token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        });

        delete user.password;
        res.status(200).send({
            status: true,
            data: {
                user: user,
                authToken: token,
                message: constant.userLogin
            }
        });
        return
    }).catch(err => {
        return res.status(401).send({
            status: false,
            message: "Email is not registered"
        });
    });
}

exports.getDashboardData = (req, res) => {
    let userId = req.userId;
    User.findOne({
        where: {
            id: userId
        }
    }).then(user => {
        if (user.type == constant.userType.User) {
            res.status(200).send({
                status: true,
                data: user
            });
            return
        } else {
            User.findAll({
                where: {
                    type: {
                        [Op.ne]: 'Admin'
                    }
                }
            }).then((users) => {
                res.status(200).send({
                    status: true,
                    data: users
                });
                return
            })
        }
    }).catch(err => {
        return res.status(401).send({
            status: false,
            message: "User is not registered"
        });
    });
}