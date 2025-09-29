const prisma = require("../configure/prisma");

exports.create_bill = async (req, res) => {
  try {
    const { tableId, branchId, orderId, discount = 0, tax = 0 } = req.body;

    if (!tableId || !branchId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Fetch the order
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menu: true } } },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    let amount = existingOrder.total;
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total is zero, cannot create bill",
      });
    }

    // Apply discount
    let discountedAmount = amount;
    if (discount > 0) {
      discountedAmount -= amount * (discount / 100);
    }

    // Apply tax
    const total = discountedAmount + discountedAmount * (tax / 100);

    // Create bill
    const bill = await prisma.bill.create({
      data: {
        orderId,
        amount,
        discount,
        tax,
        total,
      },
      include: { order: { include: { items: { include: { menu: true } } } } },
    });

    return res.status(201).json({
      success: true,
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server issue, try again later",
    });
  }
};
exports.update_bill = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount, tax } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Bill ID is required",
      });
    }
    const existingBill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: { order: { include: { items: { include: { menu: true } } } } },
    });
    if (!existingBill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    let amount = existingBill.order.total;
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total is zero, cannot update bill",
      });
    }
    // Apply discount
    let discountedAmount = amount;
    if (discount !== undefined) {
      discountedAmount -= amount * (discount / 100);
    } else {
      discount = existingBill.discount;
    }
    // Apply tax
    if (tax !== undefined) {
      discountedAmount += discountedAmount * (tax / 100);
    } else {
      tax = existingBill.tax;
    }
    const total = discountedAmount;
    // Update bill
    const updatedBill = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: {
        discount,
        tax,
        total,
      },
      include: {
        order: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      bill: updatedBill,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server issue, try again later",
    });
  }
};
exports.get_bill_by_Id = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Bill ID is required",
      });
    }
    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: { order: { include: { items: { include: { menu: true } } } } },
    });
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bill fetched successfully",
      bill,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server issue, try again later",
    });
  }
};
