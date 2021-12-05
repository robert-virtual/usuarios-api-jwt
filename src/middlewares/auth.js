const { verify } = require("jsonwebtoken");

async function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Es necesario autenticarse para cceder a esta ruta",
    });
  }
  try {
    let payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      error,
    });
  }
}

module.exports = auth;
