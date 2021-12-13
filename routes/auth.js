const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { wrapAsync, makeError } = require("../utils");

const router = express.Router();

router.post(
  "/email",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw makeError("존재하지 않는 이메일입니다.", 402);
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw makeError("잘못된 비밀번호입니다.", 403);
    }

    const { nickname, id } = user;

    return res.status(200).json({ nickname, id });
  })
);

module.exports = router;
