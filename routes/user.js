const express = require("express");
const { User } = require("../models");
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

module.exports = router;
