'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    toJSON() {
      let values = Object.assign({}, this.get());
      return {
        id: values.id,
        level: values.level,
        letter: values.letters,
        words: JSON.parse(values.words)
      };
    }

    static associate(models) {
      // define association here
    }
  }
  Level.init({
    letters: DataTypes.STRING,
    words: DataTypes.STRING,
    level: DataTypes.INTEGER,
    meta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Level',
  });
  return Level;
};