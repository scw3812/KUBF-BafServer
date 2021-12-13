const express = require("express");
const { col } = require("sequelize");
const { Post, User } = require("../models");
const { wrapAsync, makeError } = require("../utils");

const router = express.Router();

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { userId, title, content, categoryId } = req.body;

    await Post.create({ userId, title, content, categoryId });

    return res.status(201).json({});
  })
);

router.get(
  "/latest",
  wrapAsync(async (req, res) => {
    const post = await Post.findOne({
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

    return res.status(201).json({ post });
  })
);

router.get(
  "/categories/:categoryId",
  wrapAsync(async (req, res) => {
    const posts = await Post.findAll({
      where: { categoryId: req.params.categoryId },
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

    return res.status(201).json({ posts });
  })
);

router
  .route("/:id")
  .delete(
    wrapAsync(async (req, res) => {
      await Post.destroy({ where: { id: req.params.id } });

      return res.status(200).json({});
    })
  )
  .patch(
    wrapAsync(async (req, res) => {
      const { title, content } = req.body;

      await Post.update(
        { title, content },
        {
          where: { id: req.params.id },
        }
      );

      return res.status(200).json({});
    })
  );

module.exports = router;
