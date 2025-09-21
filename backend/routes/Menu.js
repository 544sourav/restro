const express = require("express");
const router = express.Router();
const { create_menu, get_branch_menus } = require("../controllers/Menu");
const {auth,isManager} = require("../middlewares/auth");
router.post("/create_menu/:branchId",auth,isManager, create_menu);
router.get("/branch_menus/:branchId",auth,get_branch_menus);
module.exports = router;