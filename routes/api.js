const express = require('express');
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const { User } = require("../models")
const {UserController} = require("../controllers/UserController");
const {methodsHandler} = require("../middleware/methods");
const {LevelController} = require("../controllers/LevelController");


router.route('/profile').get(verifyToken, UserController.getProfile).all(methodsHandler)
router.route('/update-profile').put(verifyToken, UserController.updateProfileValidations(), UserController.updateProfile).all(methodsHandler)
router.route('/create-level').post(verifyToken, LevelController.createLevelValidations(), LevelController.createLevel).all(methodsHandler)
router.route('/levels').get(LevelController.getLevels).all(methodsHandler)

module.exports = router