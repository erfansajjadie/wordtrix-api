const {validationResult} = require("express-validator");
const {User} = require("../models");

const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};


const checkExists = (input, param,) => {
    return User.count({ where: { [param]: input} }).then(count => {
        if (count !== 0) {
            return Promise.reject(`${param} already in use`);
        }
    });
}
exports.validate = validate;
exports.checkExists = checkExists