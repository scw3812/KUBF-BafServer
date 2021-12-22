const express = require("express");
const { Op } = require("sequelize");
const { Category, Post } = require("../models");
const { wrapAsync } = require("../utils");
const { DateTime } = require("luxon");

const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const categories = await Category.findAll({
       where: { name: { [Op.not]: '다이렉트'} },
       include: [
         {
           model: Post,
           as: 'posts',
           attributes: ['createdAt'],
         }
       ] 
    });
    return res.status(200).json({ categories: categories.map((category) => {
      const posts = category.posts.filter((post) => 
        DateTime.fromJSDate(post.createdAt).plus({ hours: 9 }).diffNow(['days', 'hours']).days === 0
      );
      if (posts.length) {
        return { id: category.id, name: category.name, hasNew: true }
      }
      return { id: category.id, name: category.name, hasNew: false }
    }) });
  })
);

module.exports = router;
