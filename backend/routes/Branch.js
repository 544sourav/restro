const express  = require("express");
const router = express.Router();
const { create_branch, get_all_branches } = require("../controllers/Branch");
const { auth, isAdmin} = require("../middlewares/auth");

router.post("/create-branch",auth,isAdmin, create_branch);
router.get("/get-all-branches",auth,isAdmin, get_all_branches);

module.exports = router;