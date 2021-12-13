const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { wrapAsync, makeError } = require("../utils");

const router = express.Router();

router.post(
  "/email",
  wrapAsync(async (req, res) => {
    const { email, password, nickname, name } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const { id } = await User.create({
      email,
      password: hash,
      nickname,
      name,
      isAdmin: false,
    });

    return res.status(201).json({ id });
  })
);

router.post(
  "/duplicate/email",
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      throw makeError("이미 존재하는 계정입니다.", 400);
    }
    return res.status(200).json({});
  })
);

router.post(
  "/duplicate/nickname",
  wrapAsync(async (req, res) => {
    const { nickname } = req.body;
    const exUser = await User.findOne({ where: { nickname } });
    if (exUser) {
      throw makeError("이미 존재하는 닉네임입니다.", 400);
    }
    return res.status(200).json({});
  })
);

module.exports = router;
