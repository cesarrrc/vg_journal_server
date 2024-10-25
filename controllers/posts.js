const connection = require("../utils/sql/connection");

const getAllPosts = (req, res) => {
  const sql = `
    SELECT 
      p.id, 
      p.user_id, 
      u.username as author, 
      p.title, 
      p.description, 
      GROUP_CONCAT(vgc.category) AS categories, 
      COUNT(pl.user_id) as total_likes,
      p.create_time, 
      p.update_time 
    FROM vg_journal.posts p
      LEFT JOIN post_categories pc 
        ON pc.post_id = p.id
      LEFT JOIN video_game_categories vgc
        ON pc.category_id = vgc.id 
      LEFT JOIN users u
        ON u.id = p.user_id
      LEFT JOIN post_likes pl
        ON pl.post_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC;
  `;
  connection.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    rows.forEach((row) => {
      if (row.categories) {
        const categories = [];
        row.categories.split(",").forEach((category) => {
          categories.push(category);
        });
        row.categories = categories;
      }
      return row;
    });
    res.json({
      results: rows.length,
      data: rows,
    });
  });
};

const getPostById = (req, res) => {
  const { post_id } = req.params;
  const sql = "SELECT * FROM posts WHERE id = ?;";
  connection.query(sql, [post_id], (err, rows) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (rows.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "There is no Post with this ID",
      });
    }
    res.json({
      data: rows[0],
    });
  });
};

const getPostsByUserId = (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM posts WHERE user_id = ?;";
  connection.query(sql, [user_id], (err, rows) => {
    console.log(rows);
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (rows.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "There are no Posts for this User",
      });
    }
    res.json({
      results: rows.length,
      data: rows,
    });
  });
};

const getUserPosts = (req, res) => {
  const { id } = req.user;
  const sql = `
    SELECT 
      p.id, 
      p.user_id, 
      u.username as author, 
      p.title, 
      p.description, 
      GROUP_CONCAT(vgc.category) AS categories, 
      COUNT(pl.user_id) as total_likes,
      p.create_time, 
      p.update_time 
    FROM vg_journal.posts p
      LEFT JOIN post_categories pc 
        ON pc.post_id = p.id
      LEFT JOIN video_game_categories vgc
        ON pc.category_id = vgc.id 
      LEFT JOIN users u
        ON u.id = p.user_id
      LEFT JOIN post_likes pl
        ON pl.post_id = p.id
    WHERE u.id = ?
    GROUP BY p.id
    ORDER BY p.id DESC;
     
`;
  connection.query(sql, [id], (err, rows) => {
    console.log(rows);
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (rows.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "There are no Posts for this User",
      });
    }
    rows.forEach((row) => {
      if (row.categories) {
        const categories = [];
        row.categories.split(",").forEach((category) => {
          categories.push(category);
        });
        row.categories = categories;
      }
      return row;
    });
    res.json({
      results: rows.length,
      data: rows,
    });
  });
};

const createPost = (req, res) => {
  const { id } = req.user;
  const sql = `INSERT INTO posts SET ?`;
  const body = { user_id: id, ...req.body };
  connection.query(sql, [body], (err, results) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    res.status(201).json({
      message: "Post Created",
      status: 201,
      post_id: results.insertId,
      data: {
        id: results.insertId,
        user_id: id,
        create_time: new Date(),
        ...req.body,
      },
    });
  });
};

const editPost = (req, res) => {
  const { post_id } = req.params;
  const { title, description } = req.body;
  const sql = `
    UPDATE posts
    SET title = ?, description = ?, update_time = ?
    WHERE id = ?;
  `;
  const currentTime = new Date();
  const body = [title, description, new Date(), post_id];
  connection.query(sql, body, (err, results) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (results.affectedRows === 0) {
      res.status(404).json({
        status: 404,
        message: "There is no Post with that ID",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Post updated successfully.",
      id: post_id,
      title,
      description,
      update_time: currentTime,
    });
  });
};

const deletePost = (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;
  // if(req.user.id !== user_id)
  const sql = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
  const body = [post_id, id];
  connection.query(sql, body, (err, results) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (results.affectedRows === 0) {
      res.status(404).json({
        status: 404,
        message: "There is no Post with that ID",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Post successfully deleted",
    });
  });
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  editPost,
  deletePost,
  getUserPosts,
};
