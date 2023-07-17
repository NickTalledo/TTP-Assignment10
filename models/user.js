"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-Many association with Post
      User.hasMany(models.Post, {
        foreignKey: "userId", // This is the foreign key in the Post table that points to the primary key (id) in the User table
        as: "posts", // Alias to use when retrieving associated posts
      });

      // One-to-Many association with Comment
      User.hasMany(models.Comment, {
        foreignKey: "userId", // This is the foreign key in the Comment table that points to the primary key (id) in the User table
        as: "comments", // Alias to use when retrieving associated comments
      });
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  return User;
};
