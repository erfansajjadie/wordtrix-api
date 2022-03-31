const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validate, checkExists} = require("../middleware/validator");
const { body, validationResult} = require("express-validator");
const { generateHash, compareHash} = require("../utils/hashGenerator");
const {where, Op} = require("sequelize");



class UserController {


    async login (req, res) {
        let user = await  User.findAll({ where: { deviceId : req.body.deviceId }});
        if(user.length !== 0) {
            let token = jwt.sign({ user }, process.env.TOKEN_SECRET, {expiresIn: '180000000s'});
            return res.send({ user: user, token: token })
        }
        return res.send({ success: false, message: "Device not registered" })
    }

    async register(req, res) {
        let user = await User.create({ username : req.body.username,  deviceId: req.body.deviceId})
        let token = jwt.sign({ user }, process.env.TOKEN_SECRET, {expiresIn: '180000000s'});
        return res.send({ user: user, token: token })
    }

    static async getProfile(req, res) {
        return res.send(req.user["id"])
        return res.status(200).send(await User.findOne({where: {deviceId: req.user["id"]}}));
    }

    static async updateProfile(req, res) {
        const user = await User.findOne({ where: { deviceId: req.user["id"]} })
        await user.update(req.body);
        res.send(user)

    }

    static async getRanks(req, res) {
        const users = await User.findAll({ order: [['score', 'DESC']] });
        return res.send({data: users});
    }

    registerValidations() {
        return validate([
            body('deviceId').notEmpty().withMessage("deviceId must not be empty"),
            body('username').notEmpty().withMessage('user name ').isLength({ min: 3 })
                .withMessage("username must have at least 3 length")
                .custom(input => checkExists(input, "username"))
        ])
    }

    loginValidations() {
        return validate([
            body('deviceId').notEmpty().withMessage("deviceId must not be empty"),
        ])
    }

    static  updateProfileValidations() {
        return validate([
            body('username').optional().custom(input => checkExists(input, "username"))
        ])
    }
}
exports.UserController = UserController;