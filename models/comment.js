"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Many-to-One association with User (Comment belongs to a User)
      Comment.belongsTo(models.User, {
        foreignKey: "userId", // This is the foreign key in the Comment table that points to the primary key (id) in the User table
        as: "user", // Alias to use when retrieving the associated user
      });

      // Many-to-One association with Post (Comment belongs to a Post)
      Comment.belongsTo(models.Post, {
        foreignKey: "postId", // This is the foreign key in the Comment table that points to the primary key (id) in the Post table
        as: "post", // Alias to use when retrieving the associated post
      });
    }
  }

  Comment.init(
    {
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comment",
    }
  );

  return Comment;
};
