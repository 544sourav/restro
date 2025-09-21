const prisma  = require("../configure/prisma");

exports.addOrderItem = async (req, res) => {
  try {
    const { orderId, items } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Insert multiple order items
    const orderItemsData = items.map((i) => ({
      orderId,
      menuId: i.menuId,
      quantity: i.quantity,
    }));

    const orderItems = await prisma.orderItem.createMany({
      data: orderItemsData,
    });

    if (orderItems.count === 0) {
      return res.status(500).json({
        success: false,
        message: "Could not add order items",
      });
    }

    // Fetch order with items + menus
    const orderWithItems = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { menu: true } },
      },
    });

    if (!orderWithItems) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Calculate total
    const total = orderWithItems.items.reduce(
      (sum, i) => sum + i.menu.price * i.quantity,
      0
    );

    // Update order with new total and return updated order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { total },
      include: {
        items: { include: { menu: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order items added successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.removeOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.orderItem.delete({
      where: { id: Number(id) },
    });

    // Recalculate total
    const order = await prisma.order.findUnique({
      where: { id: item.orderId },
      include: { items: { include: { menu: true } } },
    });

    const total = order.items.reduce(
      (sum, i) => sum + i.menu.price * i.quantity,
      0
    );

    await prisma.order.update({
      where: { id: item.orderId },
      data: { total },
    });

   return res.status(200).json({ 
        success: true,
        message: "Item removed successfully" }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};