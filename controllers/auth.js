const axios = require("axios");
const connection = require("../utils/sql/connection");
const bcrypt = require("bcrypt");

const signup = (req, res, next) => {
  const { username, password, email } = req.body;

  axios(`https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      client_id: process.env.AUTH0_CLIENT_ID,
      email: email,
      password: password,
      connection: "Username-Password-Authentication",
      username: username,
    },
  })
    .then(async (response) => {
      console.log(response);
      const sql = `INSERT INTO users SET ?`;
      const hash = await bcrypt.hash(password, 10);
      const body = {
        username,
        email,
        password: hash,
        auth_id: response.data._id,
      };

      connection.query(sql, [body], (err, results) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        next();
      });
    })
    .catch((e) => {
      console.log(e.response, "catch block **********");
      if (e.response.status === 400) {
        return res.status(e.response.status).json({
          status: e.response.status,
          message: "Something went wrong",
        });
      }
      res.status(e.response.status).json({
        status: e.response.status,
        message: e.response.data.error,
      });
    });
};

const login = (req, res) => {
  const { username, password } = req.body;

  axios(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    data: {
      grant_type: "password",
      username: username,
      password: password,
      audience: process.env.AUTH0_IDENTITY,
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    },
  })
    .then((response) => {
      console.log(response, "response");
      const { access_token } = response.data;
      res.json({ access_token });
    })
    .catch((e) => {
      console.log(e.response);
      res.status(e.response.status).json({
        status: e.response.status,
        message: e.response.data.error_description,
      });
    });
};

module.exports = {
  signup,
  login,
};
