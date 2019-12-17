'use strict';
module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define(
		'users',
		{
			username: DataTypes.STRING,
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			image: DataTypes.STRING,
		},
		{}
	);
	users.associate = function(models) {
		users.hasOne(models.shoppingCart);
		users.belongsToMany(models.users, {
			through: 'followers',
			as: 'follower',
			foreignKey: 'userId',
			otherKey: 'followerId',
		});
		users.belongsToMany(models.users, {
			through: 'followers',
			as: 'followed',
			foreignKey: 'followerId',
			otherKey: 'userId',
		});
		users.hasMany(models.comments, { foreignKEy: 'userId' });
	};
	return users;
};
