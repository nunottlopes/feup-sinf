var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

/* INVENTORY */
router.get(`/`, function(req, res) {
  readDocuments("MasterFiles", "", response => {
    let products = response.find(e => {
      return e._id == "Products";
    }).products;

    res.send(products);
  });
});

module.exports = router;
