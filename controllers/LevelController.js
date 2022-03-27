const { Level } = require("../models");
const {validate} = require("../middleware/validator");
const {body} = require("express-validator");
const {isNumeric} = require("validator");

class LevelController {
    static async createLevel(req, res){
        let data = req.body;
        data.letters = data.letters.join(',');
        data.words = JSON.stringify(data.words);
        const level = await Level.create(req.body)
        return res.status(201).send({message: "Level Created", level: level})
    }

    static async getLevels(req, res) {
        return res.send({
            seasonsCount: 20,
            data: await Level.findAll()
        });
    }

    static createLevelValidations() {
        return validate([
            body("letters").isArray({ min: 1 }).custom((value) => {
                if (value.some(value1 => value1.length > 1)) throw new Error('Items in array should be one letter');
                if (value.some(isNumeric)) throw new Error('Items in array should not be integer');
                return true;
            }),
            body("words").isArray({ min: 1 }).withMessage("words must be an array"),
            body("level").isInt().withMessage("level must be integer"),
            body("meta").optional().isObject()
        ]);
    }
}

exports.LevelController = LevelController;