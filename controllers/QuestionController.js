const { Question } = require("../models");


class QuestionController {
    static async getQuestion(req, res) {
        return res.send(await Question.findByPk(1, { attributes: { exclude: ['createdAt', 'updatedAt'] } }));
    }
}

exports.QuestionController = QuestionController;