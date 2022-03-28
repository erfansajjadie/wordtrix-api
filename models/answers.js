'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answers extends Model {
    static associate(models) {
      // define association here
    }
  }
  Answers.init({
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    choice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Answers',
  });
  return Answers;
};