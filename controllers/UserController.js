const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validate, checkExists} = require("../middleware/validator");
const { body, validationResult} = require("express-validator");
const { generateHash, compareHash} = require("../utils/hashGenerator");
const {where, Op} = require("sequelize");



class UserController {


    async login (req, res) {
        let user = await  User.findOne({ where: { deviceId : req.body.deviceId }});
        if(user != null) {
            let token = jwt.sign({ user }, process.env.TOKEN_SECRET, {expiresIn: '180000000s'});
            return res.send({ user: user, token: token })
        }
        return res.send({ success: false, message: "Device not registered" })
    }

    async register(req, res) {
        let user = await  User.findOne({ where: { deviceId : req.body.deviceId }});
        if(user != null) {
            user = await  user.update({ username : req.body.username })
            let token = jwt.sign({ user }, process.env.TOKEN_SECRET, {expiresIn: '180000000s'});
            return res.send({ user: user, token: token })
        } else {
            let user = await User.create({ username : req.body.username,  deviceId: req.body.deviceId})
            let token = jwt.sign({ user }, process.env.TOKEN_SECRET, {expiresIn: '180000000s'});
            return res.send({ user: user, token: token })
        }
    }

    static async getProfile(req, res) {
        return res.status(200).send(await User.findOne({where: {id: req.user.id}}));
    }

    static async updateProfile(req, res) {
        const user = await User.findOne({ where: { id: req.user.id} })
        await user.update(req.body);
        res.send(user)
    }

    static async deleteUser(req, res) {
        const user = await User.findOne({ where: { id: req.user.id} })
        if(user != null) {
            await user.destroy();
        }else {
            return res.send({success: false})
        }
        res.send({success: true})
    }

    static async getRanks(req, res) {
        const users = await User.findAll({ order: [['levelId', 'DESC']] });
        return res.send({data: users});
    }

    registerValidations() {
        return validate([
            body('deviceId').notEmpty().withMessage("deviceId must not be empty"),
            body('username').notEmpty().withMessage('user name ').isLength({ min: 3 })
                .withMessage("username must have at least 3 length")
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