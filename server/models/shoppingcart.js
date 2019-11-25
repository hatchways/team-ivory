'use strict';
module.exports = (sequelize, DataTypes) => {
	const shoppingCart = sequelize.define(
		'shoppingCart',
		{
			status: DataTypes.STRING,
		},
		{}
	);
	shoppingCart.associate = function(models) {
		shoppingCart.belongsTo(models.users, { foreignKey: 'userId' });
		shoppingCart.belongsToMany(models.ingredients, {
			through: 'ingredientCart',
			as: 'ingredients',
			foreignKey: 'cartId',
			otherKey: 'ingredientId',
		});
	};
	return shoppingCart;
};
