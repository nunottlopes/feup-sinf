var localStorage = require("../utils/local-storage");
var request = require("request-promise");
var config = require("./config.js")["jasmin"];

/* --------- AUTHENTICATION --------- */

fetchToken = async () => {
  await request({
    url: config.token_url,
    method: "POST",
    auth: {
      user: config.token_client_id,
      pass: config.token_client_secret
    },
    form: {
      grant_type: config.token_grant_type,
      scope: config.token_scope
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

var url = config.url;
var tenant = config.tenant;
var organization = config.organization;

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

exports.getJasminAPI = async (endpoint) => {
  return await request({
    method: "GET",
    url: `${url}/api/${tenant}/${organization}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: await this.getToken(),
    }
  });
};