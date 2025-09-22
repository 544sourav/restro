const express = require("express");
const router = express.Router();
const {
  create_bill,
  update_bill,
  get_bill_by_Id,
} = require("../controllers/Biller");

router.post("/create", create_bill);
router.put("/update/:id", update_bill);
router.get("/:id", get_bill_by_Id);

module.exports = router;
