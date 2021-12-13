const express = require("express");
const { User, Show } = require("../models");
const { wrapAsync, makeError } = require("../utils");

const router = express.Router();

const checkIsExisted = (user, show) => {
  if (!user) {
    throw makeError("유저 데이터가 존재하지 않습니다.", 400);
  }
  if (!show) {
    throw makeError("공연 데이터가 존재하지 않습니다.", 400);
  }
};

router
  .route("/")
  .post(
    wrapAsync(async (req, res) => {
      const user = await User.findByPk(req.decoded.id);
      const show = await Show.findByPk(req.body.showId);
      checkIsExisted(user, show);
      await user.addShow(show);

      return res.status(201).json({});
    })
  )
  .get(
    wrapAsync(async (req, res) => {
      const user = await User.findByPk(req.decoded.id);
      if (!user) {
        throw makeError("데이터가 존재하지 않습니다.", 400);
      }
      const shows = await user.getShows({
        attributes: ["id", "title", "poster"],
        joinTableAttributes: [],
      });

      return res.status(200).json({ shows });
    })
  );

router
  .route("/:id")
  .get(wrapAsync(async (req, res) => {
      const user = await User.findByPk(req.decoded.id, {
        include: [
          {
            model: Show,
            as: 'shows',
          }
        ]
      });
      return res.status(200).json({ isLiked: user.shows.length !== 0 });
  }))
  .delete(
    wrapAsync(async (req, res) => {
      const user = await User.findByPk(req.decoded.id);
      const show = await Show.findByPk(req.params.id);
      checkIsExisted(user, show);
      const success = await user.removeShow(show);
      if (!success) {
        throw makeError("찜한 공연이 존재하지 않습니다.", 400);
      }
      return res.status(200).json({});
    })
  );

module.exports = router;
