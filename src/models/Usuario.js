const { DataTypes, UUIDV4 } = require("sequelize");
const db = require("../db/database");
const Post = require("./Post.");

const Usuario = db.define("Usuarios", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
  },
  nombre: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  token: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Usuario.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(Usuario, { foreignKey: "userId" });

module.exports = Usuario;
