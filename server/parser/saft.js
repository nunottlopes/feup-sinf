var parser = require("fast-xml-parser");

exports.parseSaft = () => {
  if (parser.validate(xmlData) === true) {
    //optional (it'll return an object in case it's not valid)
    var jsonObj = parser.parse(xmlData, options);
  }
};
