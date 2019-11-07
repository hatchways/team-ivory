'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipes = sequelize.define('recipes', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    ingredients: DataTypes.ARRAY(DataTypes.STRING),
    steps: DataTypes.ARRAY(DataTypes.STRING),
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  recipes.associate = function(models) {
    // associations can be defined here
  };
  return recipes;
};