const express = require('express');
const router = express.Router();
const { create_order, get_branch_orders, getOrderById, updateOrder, updateOrderStatus, deleteOrder } = require('../controllers/Order');
const {removeOrderItem, addOrderItem } = require('../controllers/Orderitem')

router.post('/create_order', create_order);
router.get('/branch_orders/:branchId', get_branch_orders);
router.get('/order/:id', getOrderById);
router.put('/update_order/:id', updateOrder);
router.patch('/update_order_status/:id', updateOrderStatus);
router.delete('/delete_order/:id', deleteOrder);
router.post('/add_order_item', addOrderItem);
router.delete('/remove_order_item/:id', removeOrderItem);

module.exports = router;