const db = require('../conn');
const User = db.users;
const constant = require("../config/constant");

checkDuplicateEmail = (req, res, next) => {

    User.findAll({
        where: {
            email: req.body.email
        }
    }).then(users => {
        if (users.length) {
            res.status(401).send({
                status: false,
                data: {
                    message: constant.userExist
                }
            });
            return
        }
        next();
    });
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail
};

module.exports = { verifySignUp };