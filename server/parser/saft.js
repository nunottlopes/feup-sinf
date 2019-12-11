var parser = require("fast-xml-parser");
const path = require("path");
const {
  handleDemoSAFT,
  handleAccountingSAFT
} = require("../mongodb/saftHandler");

const fs = require("fs");

const parseAccountingSaft = res => {
  fs.readFile(
    path.resolve(__dirname, "../assets/SAFT_Sample_Accounting_2019.xml"),
    (err, data) => {
      if (err) throw err;

      if (parser.validate(data.toString()) === true) {
        var jsonObj = parser.parse(data.toString());
        handleAccountingSAFT(jsonObj, res);
      }
    }
  );
};

exports.parseSaft = res => {
  fs.readFile(
    path.resolve(
      __dirname,
      "../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml"
    ),
    (err, data) => {
      if (err) throw err;

      if (parser.validate(data.toString()) === true) {
        var jsonObj = parser.parse(data.toString());
        handleDemoSAFT(jsonObj, parseAccountingSaft, res);
      }
    }
  );
};
