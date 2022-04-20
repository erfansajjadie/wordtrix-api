const { Question, User, Answers } = require("../models");


class QuestionController {
    static async getQuestion(req, res) {
        let question = await Question.findByPk(1, { attributes: { exclude: ['createdAt', 'updatedAt', 'answer'] } });
        let answer = await Answers.findOne({ where: { userId: req.user.id, questionId: question.id }});
        return res.send({
            question: question,
            answer: answer
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
            if (value.answer === req.body.choice) {
                let user = await User.increment('score', {by: 200, where: {id: req.user.id}});
                let answer = await Answers.create({
                    userId: req.user.id,
                    questionId: req.params.id,
                    choice: req.body.choice
                })
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
}

exports.QuestionController = QuestionController;