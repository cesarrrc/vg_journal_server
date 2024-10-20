const axios = require("axios");
const connection = require("../utils/connection");
const bcrypt = require("bcrypt");

const signup = (req, res) => {
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
      grant_type: "client_credentials",
    },
  })
    .then(async (response) => {
      console.log(response);
      const sql = `
        INSERT INTO users
        SET ?
      `;
      const hash = await bcrypt.hash(password, 10);
      const body = [
        {
          username,
          password: hash,
          email,
          auth_id: response.data._id,
        },
      ];
      connection.query(sql, body, (err, results) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        console.log(results);
        return res.json("signed up");
      });
    })
    .catch((e) => {
      console.log(e);
      res.json(e);
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
      connection: "Username-Password-Authentication",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    },
  })
    .then((response) => {
      console.log(response);
      const { access_token } = response.data;
      res.json({
        access_token,
      });
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
};

module.exports = {
  signup,
  login,
};
