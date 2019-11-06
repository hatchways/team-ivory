'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredients = sequelize.define('ingredients', {
    name: DataTypes.STRING
  }, {});
  ingredients.associate = function(models) {
    // associations can be defined here
  };
  return ingredients;
};