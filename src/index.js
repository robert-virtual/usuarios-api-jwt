const expres = require("express");
require("dotenv").config();
const app = expres();
const usuarios = require("./routes/usuarios");
const cors = require("cors");
const db = require("./db/database");
const posts = require("./routes/posts");
const port = process.env.PORT || 3030;

(async () => {
  try {
    await db.authenticate();
    await db.sync({ force: false });
    console.log("db connectada!");
  } catch (error) {
    throw new Error(error);
  }
})();

app.use(cors());
app.use(expres.json());
app.use("/usuarios", usuarios);
app.use("/posts", posts);

app.listen(port, () => {
  console.log("servidor ejecutandose en el puerto:", port);
});
