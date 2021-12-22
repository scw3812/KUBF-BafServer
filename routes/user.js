const express = require("express");
const { col } = require("sequelize");
const { User, Post, Comment } = require("../models");
const { wrapAsync, makeError } = require("../utils");

const router = express.Router();

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const success = await User.destroy({ where: { id: req.params.id } });
    if (!success) {
      throw makeError("데이터가 존재하지 않습니다.", 400);
    }
    return res.status(200).json({});
  })
);

router.get(
  "/:id/profile",
  wrapAsync(async (req, res) => {
    const postCount = await Post.count({ where: { userId: req.params.id }});
    const commentCount = await Comment.count({ where: { userId: req.params.id }});
    return res.status(200).json({ postCount, commentCount });
  })
);

router.get(
  "/:id/posts",
  wrapAsync(async (req, res) => {
    const posts = await Post.findAll({ 
      where: { userId: req.params.id },
      attributes: [
        "id",
        "title",
        "content",
        "createdAt",
        [col("user.nickname"), "nickname"],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ posts });
  })
);

router.get(
  "/:id/comments",
  wrapAsync(async (req, res) => {
    const comments = await Comment.findAll({ 
      where: { userId: req.params.id },
      attributes: [],
      include: [
        {
          model: Post,
          as: "post",
          attributes: [
            "id",
            "title",
            "content",
            "createdAt",
          ],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['nickname'],
            }
          ]
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const postIds = [];
    const posts = [];
    comments.forEach((comment) => {
      const { user, ...post } = comment.get({ plain: true }).post;
      if (!postIds.includes(post.id)) {
        postIds.push(post.id);
        posts.push({ ...post, nickname: user.nickname });
      }    
    });
    return res.status(200).json({ posts });
  })
);

module.exports = router;
