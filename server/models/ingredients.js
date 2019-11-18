'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredients = sequelize.define('ingredients', {
    name: DataTypes.STRING,
    quantity: DataTypes.FLOAT,
    unit: DataTypes.STRING,
    outsideId: DataTypes.STRING,
  }, {});
  ingredients.associate = function(models) {
    ingredients.belongsTo(models.recipes, {foreignKey: 'recipeId'})
    ingredients.belongsToMany(models.shoppingCart,{
      through: 'ingredientCart',
      as: 'carts',
      foreignKey: 'ingredientId',
      otherKey: 'cartId'
    })
  };
  return ingredients;
};