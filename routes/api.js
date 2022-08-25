const express = require('express');
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const { User } = require("../models")
const {UserController} = require("../controllers/UserController");
const {methodsHandler} = require("../middleware/methods");
const {LevelController} = require("../controllers/LevelController");
const { QuestionController } = require("../controllers/QuestionController")

router.route('/profile').get(verifyToken, UserController.getProfile).all(methodsHandler)
router.route('/update-profile').put(verifyToken, UserController.updateProfileValidations(), UserController.updateProfile).all(methodsHandler)
router.route('/create-level').post(verifyToken, LevelController.createLevelValidations(), LevelController.createLevel).all(methodsHandler)
router.route('/question').get(verifyToken, QuestionController.getQuestion).all(methodsHandler)
router.route('/answer/:id').post(verifyToken, QuestionController.answerQuestion).all(methodsHandler)
router.route('/delete-user').delete(verifyToken, UserController.deleteUser).all(methodsHandler)
router.route('/levels').get(LevelController.getLevels).all(methodsHandler)
router.route('/ranks').get(UserController.getRanks).all(methodsHandler)
router.route('/create-question').post(QuestionController.createQuestion, QuestionController.createQuestionValidations).all(methodsHandler)

module.exports = router