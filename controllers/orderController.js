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

//All orders data for admin panel
const allOrders = async (req, res) => {
  // const { userId } = req.body;
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
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
const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
