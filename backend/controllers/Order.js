const prisma = require('../configure/prisma');

exports.create_order = async (req, res) => {
  try {
    const { tableId, branchId, items } = req.body;

    if (!tableId || !branchId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Calculate total before creating the order
    let total = 0;
    for (let i of items) {
      const menu = await prisma.menu.findUnique({ where: { id: i.menuId } });
      if (!menu) {
        return res.status(400).json({
          success: false,
          message: `Menu item with id ${i.menuId} not found`,
        });
      }
      total += i.quantity * menu.price;
    }

    // Create order with nested items
    const order = await prisma.order.create({
      data: {
        tableId,
        branchId,
        total,
        items: {
          create: items.map((i) => ({
            menuId: i.menuId,
            quantity: i.quantity,
          })),
        },
      },
      include: {
        items: { include: { menu: true } },
        table: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Server issue, try again later",
    });
  }
};
exports.get_branch_orders = async (req, res) => {
  try {
    const { branchId, status } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        branchId: branchId ? Number(branchId) : undefined,
        status: status || undefined,
      },
      include: { items: true, table: true, user: true, bill: true },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: { include: { menu: true } }, table: true, bill: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableId, branchId, userId } = req.body;

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { tableId, branchId, userId },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};