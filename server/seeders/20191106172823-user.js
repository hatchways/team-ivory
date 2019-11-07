'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   // seed test user
   const user = {
     username: "testuser",
     firstName: "Team",
     lastName: "Ivory",
     email: "test@test.com",
     password: "test",
     createdAt: new Date(),
     updatedAt: new Date()
   }
   
   return queryInterface.bulkInsert('users', [ user ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
