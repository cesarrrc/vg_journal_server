const jwt = require("jsonwebtoken");

const validateUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SERVER_SECRET);
  console.log(decoded);
  req.user = decoded;
  next();
};

module.exports = validateUser;

/* NOTES ON CLIENT ACCESS TOKENS AND ID TOKENS

The standard solution is like this:

Service A uses Client Credentials flow to get a token for Service B - the first time it is needed
Service A then caches this token for subsequent calls to Service B
When the Service B token expires, a 401 is received by Service A
Service A then uses the Client Credentials flow again, to renew the token
Service A then retries the API call with the new token
The Service B token is usually returned from an Authorization Server rather than from Service B itself
*/