const { Question, User, Answers, Level} = require("../models");
const {validate} = require("../middleware/validator");
const {body} = require("express-validator");
const {isNumeric} = require("validator");


class QuestionController {

    static async createQuestion (req, res) {
        if(req.body.isEmpty() == null) {

        }
        let data = req.body;

        const question = await Question.create(req.body)
        return res.status(201).send({message: "Question Created", question: question})
    }

    static async getQuestion(req, res) {
        let question = await Question.findByPk(1, { attributes: { exclude: ['createdAt', 'updatedAt'] } });
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
            body("choices").isArray({ min: 1 }).withMessage("answer must be integer"),
        ]);
    }
}

exports.QuestionController = QuestionController;