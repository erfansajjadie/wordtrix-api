const express = require('express');
const router = express.Router();
const { User } = require("../models")
const { UserController } = require("../controllers/UserController");
const { methodsHandler } = require("../middleware/methods");

const controller = new UserController();



router.route('/register').post(controller.registerValidations() , controller.register).all(methodsHandler)
router.route('/login').post(controller.loginValidations(), controller.login).all(methodsHandler)

module.exports = router