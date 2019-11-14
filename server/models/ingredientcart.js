'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredientCart = sequelize.define('ingredientCart', {
    ingredientId: DataTypes.INTEGER
  }, {});
  ingredientCart.associate = function(models) {
    
  };
  return ingredientCart;
};