'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorites = sequelize.define('favorites', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER
  }, {});
  favorites.associate = function(models) {
    // associations can be defined here
  };
  return favorites;
};