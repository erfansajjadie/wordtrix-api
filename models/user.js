'use strict';
const {
  Model
} = require('sequelize');



module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    toJSON() {
      let values = Object.assign({}, this.get());
      return {
        id: values.id,
        username: values.username,
        level: values.levelId,
        score: values.score
      };
    }

    static associate(models) {
      this.belongsTo(models.Level);
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    levelId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    score: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};