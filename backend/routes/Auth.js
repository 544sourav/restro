const express = require("express");
const router = express.Router();
const { celestial_signin, create_user, login } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");

router.post("/celestial-signin", celestial_signin);
router.post("/create-user",auth, create_user);
router.post("/login", login);

module.exports = router;