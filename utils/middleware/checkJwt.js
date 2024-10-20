const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "express-app",
  issuerBaseURL: `https://cesarrr.us.auth0.com/`,
});

module.exports = checkJwt;

/* NOTES ON CLIENT ACCESS TOKENS AND ID TOKENS

The standard solution is like this:

Service A uses Client Credentials flow to get a token for Service B - the first time it is needed
Service A then caches this token for subsequent calls to Service B
When the Service B token expires, a 401 is received by Service A
Service A then uses the Client Credentials flow again, to renew the token
Service A then retries the API call with the new token
The Service B token is usually returned from an Authorization Server rather than from Service B itself
*/