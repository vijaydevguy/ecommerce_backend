import orderModel from "../modals/orderModel.js";
import userModel from "../modals/userModel.js";

// placing orders using COD method

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cart: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    res.json({ success: false, message: `${error.message}` });
  }
};

// placing orders using stripe method
const placeOrderStripe = async (req, res) => {};

// placing orders using string method
const placeOrderRazorpay = async (req, res) => {};

//All orders data for admin panel with pagination, search, and status filter
const allOrders = async (req, res) => {
  try {
    const { page, limit, status, search } = req.query;
    const filter = {};

    // Filter by order status
    if (status && status !== "All") {
      filter.status = new RegExp(`^${status}$`, "i");
    }

    // Search by customer name, phone, city, or product name
    if (search && typeof search === "string" && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { "address.firstName": regex },
        { "address.lastName": regex },
        { "address.phone": regex },
        { "address.city": regex },
        { "items.name": regex },
      ];
    }

    const totalOrders = await orderModel.countDocuments(filter);
    const ordersQuery = orderModel.find(filter).sort({ date: -1 });

    if (String(limit).toLowerCase() === "all" || (!page && !limit)) {
      const orders = await ordersQuery;
      return res.json({
        success: true,
        orders,
        pagination: {
          totalOrders,
          totalPages: 1,
          currentPage: 1,
          limit: orders.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
        totalOrders,
        totalPages: 1,
        currentPage: 1,
        limit: orders.length,
      });
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    const orders = await ordersQuery.skip(skip).limit(limitNum);

    res.json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      totalOrders,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//user order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
