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
        season: values.season,
        letters: values.letter,
        words: values.words,
        positions: JSON.parse(values.positions),
      };
    }

    static associate(models) {
      // define association here
    }
  }
  Level.init({
    letters: DataTypes.STRING,
    words: DataTypes.STRING,
    positions: DataTypes.STRING,
    level: DataTypes.INTEGER,
    season: DataTypes.INTEGER,
    meta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Level',
  });
  return Level;
};