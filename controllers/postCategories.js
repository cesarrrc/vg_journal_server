const axios = require("axios");
const connection = require("../utils/sql/connection");

const getAllPostCategories = (req, res) => {
  const sql = "SELECT * FROM post_categories";
  connection.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    res.json(rows);
  });
};

const getPostCategories = (req, res) => {
  const sql = `
    SELECT * FROM post_categories pc
    JOIN video_game_categories vgc
    ON vgc.id = pc.category_id
    WHERE post_id = ?
  `;
  connection.query(sql, [req.params.post_id], (err, rows) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    res.json(rows);
  });
};

const addPostCategories = (req, res) => {
  console.log(req.body);
  console.log(req.body);
  const { post_id } = req.params;
  const sql = `INSERT IGNORE INTO post_categories (post_id, category_id) VALUES ?`;
  const values = req.body.map((item) => [post_id, item]);
  console.log(values);
  connection.query(sql, [values], (err, results) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(200).json({
          message: "You already added this Category.",
          status: 200,
          post_id: req.params.post_id,
        });
      }
      console.log(err);
      return res.json(err);
    }
    console.log(results);
    res.status(201).json({
      message: "You Added Categories to Your Post",
      status: 201,
      id: results.insertId,
    });
  });
};

const removePostCategory = (req, res) => {
  const { post_category_id } = req.params;
  const sql = `DELETE FROM post_categories WHERE id = ?;`;
  connection.query(sql, [post_category_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(results);
    if (results.affectedRows === 0) {
      return res.status(200).json({
        message: "You already Removed this Category from this Post",
        status: 200,
        // post_id: post_id,
      });
    }
    res.status(200).json({
      message: "You Removed this Category from this Post",
      status: 200,
      //   post_id: post_id,
    });
  });
};

module.exports = {
  getAllPostCategories,
  getPostCategories,
  addPostCategories,
  removePostCategory,
};
