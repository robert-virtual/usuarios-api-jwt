const { hash, verify } = require("argon2");
const { sign } = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const router = require("express").Router();

// obtener todos
router.get("/", async (req, res) => {
  const usuarios = await Usuario.findAll();

  res.json(usuarios);
});

// obtener uno
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findByPk(id);
  res.json(usuario);
});

// insertar uno // register
router.post("/", async (req, res) => {
  let { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.json({ error: "uno o mas campos invalidos" });
  }
  const exist = await Usuario.findOne({ where: { email } });

  if (exist) {
    return res.status(401).json({
      error: "User already exist",
    });
  }

  password = await hash(password);
  const usuario = await Usuario.create({ nombre, email, password });
  res.json(usuario);
});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "uno o mas campos invalidos" });
  }
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(400).json({
      error: "Bad credentials",
    });
  }
  let valid = await verify(usuario.password, password);
  if (!valid) {
    return res.status(400).json({
      error: "Bad credentials",
    });
  }
  // authorization

  const accessToken = sign(
    { userId: usuario.id },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({ usuario, accessToken });
});

module.exports = router;
