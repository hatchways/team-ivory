import Sequelize from 'sequelize';
import sequelize from '../config/sequelize';

const Model = Sequelize.Model;

class User extends Model {}
User.init(
	{
		// attributes
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING,
		},
	},
	{
		// options
		sequelize,
		timestamps: false,
		modelName: 'users',
	}
);

export default User;
