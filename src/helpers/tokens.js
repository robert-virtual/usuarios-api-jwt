const { sign } = require("jsonwebtoken");

function genAccessToken(user) {
  return sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}
function genRefreshToken(user) {
  return sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  genAccessToken,
  genRefreshToken,
};
