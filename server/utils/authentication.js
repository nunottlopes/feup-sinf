const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var authentication = require("../config/config.js").authentication;

function authenticateCredentials(username, password) {
  const expireTime = 3600;

  if (
    bcrypt.compareSync(password, authentication.password) &&
    username === authentication.username
  ) {
    return jwt.sign(
      {
        username: username,
        exp: Math.floor(Date.now() / 1000) + expireTime
      },
      authentication.tokenSecret
    );
  }
  return null;
}

function authenticateToken(token) {
  let decode = jwt.verify(token, authentication.tokenSecret);
  if (decode.username === authentication.username) {
    return true;
  }
  return false;
}

module.exports = { authenticateToken, authenticateCredentials };
