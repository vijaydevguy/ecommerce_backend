import orderModel from "../modals/orderModel";
import userModel from "../modals/userModel";

// placing orders using COD method

const placeOrder = async (req, res) => {
    try {
        const {userId,items,amount,address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment: false,
            data: Data.now()
        }

        const newOrder = new orderModel(orderData);

        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cart:{}})

        res.json({success:true,message:"Order placed successfully"})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
};

// placing orders using string method
const placeOrderStripe = async (req, res) => {};

// placing orders using string method
const placeOrderRazorpay = async (req, res) => {};

//All orders data for admin panel
const allOrders = async(req, res) => {};

//user order data for frontend
const userOrders = async(req, res) => {};


//update order status from admin panel
const updateStatus = async(req,res) = {

}

export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus}