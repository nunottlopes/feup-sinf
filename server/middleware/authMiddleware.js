const { authenticateToken } = require("../utils/authentication");

module.exports = async function(req, res, next) {
  const token = req.cookies.__session || req.headers.authorization;
  if (token && authenticateToken(token)) {
    req.isLogged = true;
  } else {
    req.isLogged = false;
  }
  next();
};
