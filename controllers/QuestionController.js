const { Question, User, Answers, Level} = require("../models");
const {validate} = require("../middleware/validator");
const {body} = require("express-validator");
const {isNumeric} = require("validator");
const {Sequelize} = require("sequelize/types");


class QuestionController {

    static async createQuestion (req, res) {
        let data = req.body;
        data.choices = JSON.stringify(data.choices);
        const question = await Question.create(data)
        return res.status(201).send({message: "Question Created", question: question})
    }

    static async getQuestion(req, res) {
        let question = await Question.findOne({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: [
                Sequelize.fn( 'RAND' ),
            ] });
        let answer = await Answers.findOne({ where: { userId: req.user.id, questionId: question.id }});
        return res.send({
            question: question,
            answer: answer?.choice ?? null,
            correct_answer: answer == null ? null : question.answer
        });
    }

    static async answerQuestion(req, res) {
        //check user answered before

        let count = await Answers.count({ where: { userId: req.user.id, questionId: req.params.id }})
        if(count !== 0) {
            return res.send({
                message: "You have answered this question before"
            })
        }

        Question.findByPk(req.params.id).then(async value => {
            let answer = await Answers.create({
                userId: req.user.id,
                questionId: req.params.id,
                choice: req.body.choice
            })
            if (value.answer === req.body.choice) {
                let user = await User.increment('score', {by: 200, where: {id: req.user.id}});
                return res.send({
                    message: "Correct answer",
                    answer: answer
                })
            }
            return res.send({
                message: "Wrong answer"
            })
        }).catch(reason => res.send({message: reason.message}))
    }

    static createQuestionValidations() {
        return validate([
            body("title").notEmpty().withMessage("title must not be empty"),
            body("answer").isInt().withMessage("answer must be integer"),
            body("choices").isArray({ min: 4 }).withMessage("choices must be an array with length 4"),
        ]);
    }
}

exports.QuestionController = QuestionController;