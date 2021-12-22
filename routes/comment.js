const express = require("express");
const { col } = require("sequelize");
const { Comment, User } = require("../models");
const { wrapAsync, makeError } = require("../utils");

const router = express.Router();

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { userId, content, postId } = req.body;

    const comment = await Comment.create({ userId, content, postId });

    return res.status(201).json({ id: comment.id });
  })
);

router.get(
  "/:postId",
  wrapAsync(async (req, res) => {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      attributes: [
        "id",
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

    return res.status(201).json({ comments });
  })
);

router
  .route("/:id")
  .delete(
    wrapAsync(async (req, res) => {
      await Comment.destroy({ where: { id: req.params.id } });

      return res.status(200).json({});
    })
  )
  .patch(
    wrapAsync(async (req, res) => {
      const { content } = req.body;

      await Comment.update(
        { content },
        {
          where: { id: req.params.id },
        }
      );

      return res.status(200).json({});
    })
  );

module.exports = router;
