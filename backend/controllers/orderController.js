import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { sendOrderStatusEmail } from "../services/emailService.js";
import { sendNewOrderAdminNotification } from "../services/emailService.js";

// Placing an order with cash on delivery

const placeOrder = async (req, res) => {
  let newOrder = null;
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };

    newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // send order confirmation email
    try {
      const user = await userModel.findById(userId);
      if (user?.email) {
        await sendOrderConfirmationEmail({ to: user.email, order: newOrder });
      }
    } catch (error) {
      console.log(error);
    }
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

  try {
    await sendNewOrderAdminNotification({ order: newOrder });
  } catch (error) {
    console.log("Failed to send admin notification:", error.message);
  }
};

// Placing an order with payment gateway

const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, amount, address, reference } = req.body;

    // Verify payment with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (
      paystackRes.data.status &&
      paystackRes.data.data.status === "success" &&
      paystackRes.data.data.amount === amount * 100 // Paystack amount in kobo
    ) {
      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "paystack",
        payment: true,
        date: Date.now(),
      };

      const newOrder = new orderModel(orderData);
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      // send order confirmation email
      try {
        const user = await userModel.findById(userId);
        if (user?.email) {
          await sendOrderConfirmationEmail({ to: user.email, order: newOrder });
        }
      } catch (error) {
        console.log(error);
      }

      try {
        await sendNewOrderAdminNotification({ order: newOrder });
      } catch (error) {
        console.log("Failed to send admin notification:", error.message);
      }

      return res.json({ success: true, message: "Order Placed" });
    } else {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Getting all orders for admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

// update order status from admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    // send order status email
    try {
      const order = await orderModel.findById(orderId);
      if (order?.userId) {
        const user = await userModel.findById(order.userId);
        if (user?.email) {
          await sendOrderStatusEmail({
            to: user.email,
            orderId,
            newStatus: status,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

export { placeOrder, placeOrderPaystack, allOrders, userOrders, updateStatus };
