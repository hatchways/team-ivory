'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'ingredients',
      'quantity',
      Sequelize.FLOAT
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'ingredients',
      'quantity'
    )
  }
};
