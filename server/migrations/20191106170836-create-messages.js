'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiverId: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
        references: { 
          model: 'users',
          key: 'id'
        }
      },
      senderId: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
        references: { 
          model: 'users',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('messages');
  }
};