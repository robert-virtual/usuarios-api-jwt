const { DataTypes, UUIDV4 } = require("sequelize");
const db = require("../db/database");

const Post = db.define("Posts", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  content: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Post;
