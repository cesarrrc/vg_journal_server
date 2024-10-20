const connection = require("../utils/sql/connection");
const jwt = require("jsonwebtoken");

const getProfile = (req, res) => {
  const auth_id = req.auth.payload.sub.split("|")[1];
  console.log(auth_id, "this is the auth_id");
  const sql = `
    SELECT id, auth_id, username, email FROM users
    WHERE auth_id = ?;  
  `;
  connection.query(sql, [auth_id], (err, rows) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if (!rows[0]) {
      return res.status(404).json({
        ok: false,
        message: "No user found with that id.",
      });
    }
    const token = jwt.sign({ ...rows[0] }, process.env.JWT_SERVER_SECRET);
    res.json({
      ...rows[0],
      token,
    });
  });
};

module.exports = { getProfile };
