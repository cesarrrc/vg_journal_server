const axios = require("axios");
const connection = require("../utils/sql/connection");

const getAllLikes = (req, res) => {
  const sql = "SELECT * FROM post_likes";
  connection.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    res.json(rows);
  });
};

const getPostLikes = (req, res) => {
  const sql = `
    SELECT pl.id, post_id, user_id, username FROM post_likes pl
    JOIN users u
    ON u.id = pl.user_id
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

const getUserLikes = (req, res) => {
  const sql = "SELECT * FROM post_likes WHERE user_id = ?";
  connection.query(sql, [req.params.user_id], (err, rows) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    res.json(rows);
  });
};

const likePost = (req, res) => {
  const { id } = req.user;
  const sql = `INSERT INTO post_likes SET ?`;
  const body = { user_id: id, post_id: req.params.post_id };
  connection.query(sql, [body], (err, results) => {
    if (err) {
      if (err.errno === 1062) {
        return res.status(200).json({
          message: "You already Liked this Post.",
          status: 200,
          post_id: req.params.post_id,
        });
      }
      console.log(err);
      return res.json(err);
    }
    console.log(results);
    res.status(201).json({
      message: "You Liked this Post",
      status: 201,
      post_id: results.insertId,
    });
  });
};

const removeLike = (req, res) => {
  const { id: userId } = req.user;
  const { post_id } = req.params;
  const sql = `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?;`;
  const body = [post_id, userId];
  connection.query(sql, body, (err, results) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(results.affectedRows);
    if (results.affectedRows === 0) {
      return res.status(200).json({
        message: "You already Removed Your Like from this Post",
        status: 200,
        post_id: post_id,
      });
    }
    res.status(200).json({
      message: "You Removed Your Like from this Post",
      status: 200,
      post_id: post_id,
    });
  });
};

module.exports = {
  getAllLikes,
  getPostLikes,
  getUserLikes,
  likePost,
  removeLike,
};
