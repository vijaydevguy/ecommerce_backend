import userModel from "../modals/userModel.js";

//add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);
    const cart = (await userData.cart) || {};

    console.log("userData", userData);
    console.log("getting data", userId, itemId, size);

    if (cart[itemId]) {
      if (cart[itemId][size]) {
        cart[itemId][size] += 1;
      } else {
        cart[itemId][size] = 1;
      }
    } else {
      cart[itemId] = {};
      cart[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cart });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update products to user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    const cart = await userData.cart;

    cart[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cart });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//delete products to user cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    const cart = await userData.cart;

    console.log("userData form get userCart", userData);
    console.log("userId form get userCart", userId);
    console.log("userId form get Cart", cart);

    res.json({ success: true, cart, message: "Cart details fetched" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
