'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorites = sequelize.define('favorites', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER,
    favorited: DataTypes.INTEGER
  }, {});
  favorites.associate = function(models) {
    favorites.belongsTo(models.recipes, {
      foreignKey: 'recipeId',
    });
  };
  return favorites;
};