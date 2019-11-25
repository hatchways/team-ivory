'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable(
      'friendships',
      'followers',
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable(
      'followers',
      'friendships',
    )
  }
};
