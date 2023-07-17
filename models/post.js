"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // One-to-Many association with User (Post belongs to a User)
      Post.belongsTo(models.User, {
        foreignKey: "userId", // This is the foreign key in the Post table that points to the primary key (id) in the User table
        as: "author", // Alias to use when retrieving the associated user
      });

      // One-to-Many association with Comment (Post can have multiple Comments)
      Post.hasMany(models.Comment, {
        foreignKey: "postId", // This is the foreign key in the Comment table that points to the primary key (id) in the Post table
        as: "comments", // Alias to use when retrieving associated comments
      });
    }
  }

  Post.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "Post",
    }
  );

  return Post;
};
