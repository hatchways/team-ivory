'use strict';
module.exports = (sequelize, DataTypes) => {
  const friendships = sequelize.define('friendships', {
    userOneId: DataTypes.INTEGER,
    userTwoId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    lastActionBy: DataTypes.INTEGER
  }, {});
  friendships.associate = function(models) {
    // associations can be defined here
  };
  return friendships;
};