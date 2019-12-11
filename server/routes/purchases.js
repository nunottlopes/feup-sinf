var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

/* PURCHASES */
router.get(`/suppliers`, function(req, res) {
  readDocuments("MasterFiles", "", response => {
    let suppliers = response.find(e => {
      return e._id == "Suppliers";
    }).Suppliers;
    // console.log(suppliers)
    res.send(suppliers);
  });
});

//Pode ser paged
router.get(`/expenses`, function(req, res) {
  jasmin
    .getJasminAPI("/invoiceReceipt/expenses")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get(`/pendent-bills`, function(req, res) {});

router.get(`/orders-delivery`, function(req, res) {
  jasmin
    .getJasminAPI("/shipping/deliveries")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
