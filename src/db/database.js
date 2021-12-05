const { Sequelize } = require("sequelize");

const db = new Sequelize("usuarios_db", "root", "", {
  dialect: "mysql",
  host: "localhost",
  //   logging: false,
});

module.exports = db;
