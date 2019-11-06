'use strict';
module.exports = (sequelize, DataTypes) => {
  const tags = sequelize.define('tags', {
    name: DataTypes.STRING
  }, {});
  tags.associate = function(models) {
    // associations can be defined here
  };
  return tags;
};