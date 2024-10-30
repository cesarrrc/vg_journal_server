const axios = require("axios");
const connection = require("../utils/sql/connection");

const getAllPostComments = (req, res) => {
  const sql = `
    SELECT pc.id, post_id, user_id, u.username, uc.comment, uc.create_time, uc.update_time
    FROM post_comments pc
    LEFT JOIN user_comments uc
        ON uc.id = pc.comment_id
    LEFT JOIN users u
        ON u.id = uc.user_id
  `;
  connection.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    res.json(rows);
  });
};

const getAllCommentsForAPost = (req, res) => {
  const sql = `
    SELECT pc.id, post_id, user_id, u.username, uc.comment, uc.create_time, uc.update_time
    FROM post_comments pc
    LEFT JOIN user_comments uc
        ON uc.id = pc.comment_id
    LEFT JOIN users u
        ON u.id = uc.user_id
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

const addPostComment = (req, res) => {
  console.log(req.body);
  const { post_id } = req.params;
  const { id: user_id } = req.user;
  const { comment } = req.body;
  const sql = `
    INSERT INTO user_comments (user_id, comment) VALUES (?, ?); 
    INSERT INTO post_comments (post_id, comment_id) VALUES (?, LAST_INSERT_ID())
  `;
  const body = [user_id, comment, post_id];
  connection.query(sql, body, (err, results) => {
    if (err) {
      //   if (err.errno === 1062) {
      //     return res.status(200).json({
      //       message: "You already added this Category.",
      //       status: 200,
      //       post_id: req.params.post_id,
      //     });
      //   }
      console.log(err);
      return res.json(err);
    }
    console.log(results);
    res.status(201).json({
      message: "You added a comment to a post.",
      status: 201,
      comment_id: results[0].insertId,
      post_comment_id: results[1].insertId,
      post_id: Number(post_id),
      comment,
    });
  });
};

const removePostComment = (req, res) => {
  const { comment_id } = req.params;
  const { id: user_id } = req.user;
  const sql = `DELETE FROM user_comments WHERE id = ? AND user_id = ?;`;
  connection.query(sql, [comment_id, user_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(results);

    res.status(200).json({
      message: "You Removed this Comment from this Post",
      status: 200,
      //   post_id: post_id,
    });
  });
};

module.exports = {
  getAllPostComments,
  getAllCommentsForAPost,
  addPostComment,
  removePostComment,
};
