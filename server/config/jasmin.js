var localStorage = require("../utils/local-storage");
var request = require("request-promise");

/* --------- AUTHENTICATION --------- */

fetchToken = async () => {
  await request({
    url: process.env.JASMIN_TOKEN_URL,
    method: "POST",
    auth: {
      user: process.env.JASMIN_TOKEN_CLIENT_ID,
      pass: process.env.JASMIN_TOKEN_CLIENT_SECRET
    },
    form: {
      grant_type: process.env.JASMIN_TOKEN_GRANT_TYPE,
      scope: process.env.JASMIN_TOKEN_SCOPE
    }
  }).then(res => {
    var json = JSON.parse(res);
    setToken(json);
  });
};

setToken = json => {
  localStorage.setItem("token", json.token_type + " " + json.access_token);
  localStorage.setItem(
    "token_expires",
    new Date(Number(new Date()) - json.expires_in * 1000)
  );
};

exports.getToken = async () => {
  if (
    localStorage.length === 0 ||
    new Date(localStorage.getItem("token_expires")) < new Date()
  ) {
    await fetchToken();
  }

  return localStorage.getItem("token");
};

/* --------- ENDPOINTS --------- */

var url = process.env.JASMIN_URL;
var tenant = process.env.JASMIN_TENANT;
var organization = process.env.JASMIN_ORGANIZATION;

exports.getTaxTypeInfo = async () => {
  return await request({
    method: "GET",
    url: `${url}/api/${tenant}/${organization}/taxesCore/taxTypeCodes/getTaxTypeInfo`,
    headers: {
      Authorization: await this.getToken(),
      "Content-Type": "application/json"
    }
  });
};
