const express = require("express");
const router = express.Router();

//importing the user controllers
const {
  getAllLikedList,
  addLikedMovie,
  removeLikedMovie,
} = require("../controllers/user");

router.route("/liked/list").get(getAllLikedList);
router.route("/like").put(addLikedMovie);
router.route("/unlike").put(removeLikedMovie);

module.exports = router;
