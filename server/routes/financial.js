var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

/* FINANCIAL */

//https://moodle.up.pt/pluginfile.php/93952/mod_resource/content/1/PL_Balance_Sheet_specification.pdf

router.get(`/balance`, function(req, res) {});

router.get(`/ebit`, function(req, res) {});

router.get(`/ebitda`, function(req, res) {});

router.get(`/revenue`, function(req, res) {});

module.exports = router;
