const { hash, verify } = require("argon2");
const { verify: verifyToken } = require("jsonwebtoken");
const { genAccessToken, genRefreshToken } = require("../helpers/tokens");
const auth = require("../middlewares/auth");
const Usuario = require("../models/Usuario");

const router = require("express").Router();

// obtener usuario
router.get("/", auth, async (req, res) => {
  const { userId } = req.user;
  const usuario = await Usuario.findByPk(userId);

  res.json(usuario);
});

// insertar uno // register
router.post("/", async (req, res) => {
  let { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(401).json({ error: "uno o mas campos invalidos" });
  }
  const exist = await Usuario.findOne({ where: { email } });

  if (exist) {
    return res.status(401).json({
      error: "User already exist",
    });
  }

  password = await hash(password);
  try {
    const usuario = await Usuario.create({ nombre, email, password });
    const accesstoken = genAccessToken({ userId: usuario.id });
    const refreshToken = genRefreshToken({ userId: usuario.id });
    usuario.accessToken = accesstoken;
    usuario.refreshToken = refreshToken;
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Uno o mas campos invalidos" });
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

  const accessToken = genAccessToken({ userId: usuario.id });
  const refreshToken = genRefreshToken({ userId: usuario.id });
  usuario.token = refreshToken;
  await usuario.save();
  usuario.accessToken = accessToken;
  usuario.refreshToken = refreshToken;
  res.json(usuario);
});

// refresh token

router.post("/token", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({
      error: "No token given",
    });
  }
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.status(403).json({
      error: "access dinied",
    });
  }
  try {
    const payload = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
    const accesToken = genAccessToken({ userId: usuario.id });
    res.json({
      msg: "All good",
      accesToken,
    });
  } catch (error) {
    return res.status(403).json({
      error,
    });
  }
});

router.delete("/logout", async (req, res) => {
  const { token } = req.body;
  const { userId } = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
  const usuario = await Usuario.findByPk(userId);
  usuario.token = null;
  await usuario.save();

  res.status(204).json({
    msg: "succefully logedout",
  });
});

module.exports = router;
