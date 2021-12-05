const auth = require("../middlewares/auth");
const Post = require("../models/Post.");
const Usuario = require("../models/Usuario");

const router = require("express").Router();

// obtener todos
router.get("/", auth, async (req, res) => {
  const { userId } = req.user;
  const usuario = await Usuario.findByPk(userId, { include: Post });

  res.json(usuario);
});

// obtener uno
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const post = await Post.findByPk(id);
  res.json(post);
});

// insertar uno
router.post("/", auth, async (req, res) => {
  const { userId } = req.user;
  const { content } = req.body;
  if (!content) {
    return res.json({ error: "uno o mas campos invalidos" });
  }
  const usuario = await Usuario.findByPk(userId);
  if (!usuario) {
    return res.status(401).json({ error: "Usuario inexistente" });
  }
  const post = await Post.create({ content, userId });
  res.json(post);
});

module.exports = router;
