'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    toJSON() {
      let values = Object.assign({}, this.get());
      return {
        id: values.id,
        title: values.title,
        answer: values.answer,
        choices: JSON.parse(values.choices)
      };
    }
    static associate(models) {
      // define association here
    }
  }
  Question.init({
    title: DataTypes.STRING,
    choices: DataTypes.STRING,
    answer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};