const express = require('express');
const router = express.Router();
const { create_table, get_branch_tables,assign_waiter_to_table} = require('../controllers/Table');

const {auth,isManager} = require('../middlewares/auth');

router.post('/create_table', auth, isManager, create_table);
router.get('/branch_tables/:branchId', auth, isManager, get_branch_tables);
router.post('/assign_waiter/:branchId', auth, assign_waiter_to_table);

module.exports = router;
