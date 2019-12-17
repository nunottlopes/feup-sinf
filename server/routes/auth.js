var express = require("express");
var router = express.Router();
const { authenticateCredentials } = require("../utils/authentication");

router.post("/login", function(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(401)
      .send({ error: "Request missing username and/or password parameters" });
    return;
  }

  let authToken = authenticateCredentials(username, password);

  if (authToken !== null) {
    res.status(200).send({ token: authToken });
  } else {
    res.status(401).send({ error: "Invalid username and/or password" });
  }
});

module.exports = router;
