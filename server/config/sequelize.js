import Sequelize from 'sequelize';
import { dbLogin } from './privateData';

const sequelize = new Sequelize('RecipeApp', dbLogin.user, dbLogin.password, {
	host: 'localhost',
	// dialect: 'postgres',
	dialect: 'mysql',
});

export default sequelize;
