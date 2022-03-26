const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validate, checkExists} = require("../middleware/validator");
const { body, validationResult} = require("express-validator");
const { generateHash, compareHash} = require("../utils/hashGenerator");
const {where, Op} = require("sequelize");



class UserController {
    async register(req, res) {
        generateHash(req.body.password, async function (hash) {
            const user = await User.create({
                username: req.body.username,
                password: hash,
                role: "user"
            })
            let token = jwt.sign({user}, process.env.TOKEN_SECRET, {expiresIn: '180000000s'})
            res.send({user: user, token: token})
        })
    }

    async login(req, res) {
        const user = await  User.findOne({ where: { username:  req.body.username}})
        if(user == null) {
            return res.status(400).send({success: false, message: "Username or password is wrong"});
        }
        compareHash(req.body.password, user.password, function (result) {
            if(!result) {
                return res.status(400).send({success: false, message: "Username or password is wrong"});
            }
            let token = jwt.sign({user}, process.env.TOKEN_SECRET, {expiresIn: '180000000s'})
            return res.send({user: user, token: token})
        })
    }

    static async getProfile(req, res) {
        return res.status(200).send(await User.findOne({where: {id: req.user.id}}));
    }

    static async updateProfile(req, res) {
        const user = await User.findOne({ where: { id: req.user.id } })
        if(req.body.hasOwnProperty('password')) {
            compareHash(req.body.previous_password, user.password, async function (result) {
                if (!result) {
                    return res.status(400).send({success: false, message: "Previous password is wrong"});
                }
                await user.update(req.body);
                res.send(user)
            })
        }else {
            await user.update(req.body);
            res.send(user)
        }
    }

    static async getRanks(req, res) {
        const users = await User.findAll({ order: [['score', 'DESC']] });
        return res.send({data: users});
    }

    registerValidations() {
        return validate([
            body('password').isLength({ min: 6 }),
            body('username').custom(input => checkExists(input, "username"))
        ])
    }

    loginValidations () {
        return validate([
            body("username").notEmpty(),
            body("password").notEmpty()
        ])
    }

    static  updateProfileValidations() {
        return validate([
            body('password').optional().isLength({ min: 6 }),
            body('previous_password').if(body("password").exists()).notEmpty().withMessage("previous password is required"),
            body('username').optional().custom(input => checkExists(input, "username"))
        ])
    }

  /*  authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.TOKEN_SECRET as string, (err, user) => {
            console.log(err)

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
    }*/

}
exports.UserController = UserController;