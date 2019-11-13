'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   // seed test user
   const user = {
     username: "testuser",
     firstName: "Team",
     lastName: "Ivory",
     email: "test@test.com",
     password: "$2b$10$xJa4xYq7WvnA1d63TDSar.qPE87u21VXatJ8nHRi8g9HxTyWn7f56",
     createdAt: new Date(),
     updatedAt: new Date()
   }
   
   return queryInterface.bulkInsert('users', [ user ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
