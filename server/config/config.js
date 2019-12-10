require("dotenv").config();

module.exports = {
  jasmin: {
    token_url: process.env.JASMIN_TOKEN_URL,
    token_grant_type: process.env.JASMIN_TOKEN_GRANT_TYPE,
    token_client_id: process.env.JASMIN_TOKEN_CLIENT_ID,
    token_client_secret: process.env.JASMIN_TOKEN_CLIENT_SECRET,
    token_scope: process.env.JASMIN_TOKEN_SCOPE,
    tenant: process.env.JASMIN_TENANT,
    organization: process.env.JASMIN_ORGANIZATION,
    url: process.env.JASMIN_URL
  },
  mongodb: {
  },
  db:"mongodb://admin:admin@localhost:27017",
};
