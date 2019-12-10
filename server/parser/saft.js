var parser = require("fast-xml-parser");
const path = require("path");
const { handleAccountingSAFT } = require("../mongodb/saftHandler");

const fs = require("fs");

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
        // console.log(jsonObj);
        handleAccountingSAFT(jsonObj, res);
      }
    }
  );
};
