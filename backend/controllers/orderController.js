import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { sendOrderStatusEmail } from "../services/emailService.js";
import { sendNewOrderAdminNotification } from "../services/emailService.js";
import subscriberModel from "../models/subscriberModel.js";
import "../models/campaignModel.js";
import { resolveDiscountForCode } from "../services/discountService.js";

import crypto from "crypto";

// Helper function to calculate order amount server-side
// const calculateOrderAmount = (items, products) => {
//   let total = 0;
//   for (const item of items) {
//     const product = products.find((p) => p._id.toString() === item._id);
//     if (!product) {
//       throw new Error(`Product ${item._id} not found`);
//     }
//     const price = product.onSale ? product.salePrice : product.price;
//     total += price * item.quantity;
//   }
//   return total;
// };

// Placing an order with cash on delivery
const placeOrder = async (req, res) => {
  let newOrder = null;
  try {
    const {
      userId,
      items,
      amount,
      preDiscountAmount,
      address,
      discountCode,
    } = req.body;
    const isGuest = req.isGuest || false;

    // Basic validation - items and address are required for both guest and authenticated users
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    if (!address || !address.firstName || !address.email) {
      return res.json({ success: false, message: "Invalid address data" });
    }

    // For authenticated users, userId should be present
    if (!isGuest && !userId) {
      return res.json({
        success: false,
        message: "User authentication required",
      });
    }

    const discount = discountCode
      ? await resolveDiscountForCode({ code: discountCode, items })
      : null;
    const resolvedDiscountAmount = discount?.success
      ? discount.discountAmount
      : 0;
    const resolvedCode = discount?.success ? discount.code : null;
    const resolvedCampaignId = discount?.success ? discount.campaignId : null;
    const resolvedAmount =
      Number(preDiscountAmount) > 0
        ? Math.max(Number(preDiscountAmount) - resolvedDiscountAmount, 0)
        : Number(amount) || 0;

    const orderData = {
      userId: isGuest ? null : userId,
      items,
      address,
      amount: resolvedAmount,
      discountCode: resolvedCode,
      discountAmount: resolvedDiscountAmount,
      discountCampaignId: resolvedCampaignId,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
      isGuest: isGuest,
      guestEmail: isGuest ? address.email : null,
    };

    newOrder = new orderModel(orderData);
    await newOrder.save();

    if (resolvedCode) {
      try {
        await subscriberModel.findOneAndUpdate(
          { code: resolvedCode },
          { status: "used", usedAt: new Date() },
        );
      } catch (discountError) {
        console.error(
          "Failed to mark discount code as used:",
          discountError.message,
        );
      }
    }

    // Only clear cart for authenticated users
    if (!isGuest && userId) {
      try {
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
      } catch (error) {
        console.error("Error clearing cart:", error.message);
        // Don't fail the order if cart clearing fails
      }
    }

    // Send order confirmation email (non-blocking)
    try {
      const emailTo = isGuest ? address.email : null;
      if (emailTo) {
        // For guests, use address email directly
        await sendOrderConfirmationEmail({ to: emailTo, order: newOrder });
      } else if (!isGuest && userId) {
        // For authenticated users, get email from user model
        const user = await userModel.findById(userId);
        if (user?.email) {
          await sendOrderConfirmationEmail({ to: user.email, order: newOrder });
        }
      }
    } catch (emailError) {
      console.error("Email error:", emailError.message);
      // Don't fail the order if email fails
    }

    res.json({ success: true, message: "Order Placed", orderId: newOrder._id });

    // Send admin notification in background
    try {
      await sendNewOrderAdminNotification({ order: newOrder });
    } catch (error) {
      console.error("Failed to send admin notification:", error.message);
    }
  } catch (error) {
    console.error("Order placement error:", error);
    res.json({
      success: false,
      message: "Failed to place order. Please try again.",
    });
  }
};

// Placing an order with Paystack - SECURE VERSION
const placeOrderPaystack = async (req, res) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  try {
    const {
      userId,
      items,
      amount,
      preDiscountAmount,
      discountAmount: submittedDiscountAmount = 0,
      address,
      reference,
      discountCode,
    } = req.body;
    const isGuest = req.isGuest || false;

    // ===== VALIDATION =====
    if (!reference || typeof reference !== "string") {
      return res.json({ success: false, message: "Invalid payment reference" });
    }

    // Items validation - required for both guest and authenticated users
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    // Address validation - required for both
    if (!address || !address.firstName || !address.email) {
      return res.json({ success: false, message: "Invalid address data" });
    }

    // For authenticated users, userId should be present
    if (!isGuest && !userId) {
      return res.json({
        success: false,
        message: "User authentication required",
      });
    }

    // ===== IDEMPOTENCY CHECK =====
    // Check if order with this reference already exists
    const existingOrder = await orderModel.findOne({
      paymentReference: reference,
    });

    if (existingOrder) {
      console.log(`Duplicate order attempt with reference: ${reference}`);
      return res.json({
        success: true,
        message: "Order already processed",
        orderId: existingOrder._id,
        isDuplicate: true,
      });
    }

    // ===== VERIFY PAYMENT WITH RETRY LOGIC =====
    let paystackRes = null;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        paystackRes = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
            timeout: 10000, // 10 second timeout
          },
        );
        break; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        console.error(
          `Paystack verification attempt ${attempt} failed:`,
          error.message,
        );

        if (attempt < MAX_RETRIES) {
          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * attempt),
          );
        }
      }
    }

    // If all retries failed
    if (!paystackRes) {
      console.error(
        `All verification attempts failed for reference: ${reference}`,
      );
      return res.json({
        success: false,
        message:
          "Unable to verify payment. Please contact support with reference: " +
          reference,
        reference: reference,
      });
    }

    // ===== VALIDATE PAYMENT STATUS =====
    const paymentData = paystackRes.data?.data;

    if (!paymentData) {
      return res.json({
        success: false,
        message: "Invalid payment response",
      });
    }

    // Check payment status
    if (paymentData.status !== "success") {
      return res.json({
        success: false,
        message: `Payment ${paymentData.status}. Please try again.`,
      });
    }

    // ===== VERIFY AMOUNT (CRITICAL SECURITY CHECK) =====
    //const expectedAmount = Math.round(amount * 100); // Convert to kobo
    //const paidAmount = paymentData.amount;

    //if (paidAmount !== expectedAmount) {
    //console.error(
    //`Amount mismatch! Expected: ${expectedAmount}, Paid: ${paidAmount}`
    //);
    // return res.json({
    //success: false,
    //  message: "Payment amount mismatch. Please contact support.",
    //});
    // }

    const verifiedAmount = paymentData.amount / 100; // Paystack's confirmed amount in Naira
    const expectedPaidAmount = Number(amount) || verifiedAmount;

    // Only reject if customer was undercharged (potential fraud), never for overcharge
    if (paymentData.amount < Math.round(expectedPaidAmount * 100)) {
      console.error(
        `Underpayment detected! Expected: ${Math.round(expectedPaidAmount * 100)}, Paid: ${paymentData.amount}`,
      );
      return res.json({
        success: false,
        message: "Payment amount mismatch. Please contact support.",
      });
    }

    // Optional: Verify amount against actual product prices in database
    // This prevents frontend tampering
    // try {
    //   const products = await productModel.find({});
    //   const calculatedAmount = calculateOrderAmount(items, products);
    //   const totalWithShipping = calculatedAmount + (address.shippingFee || 0);
    //
    //   if (Math.abs(totalWithShipping - amount) > 1) { // Allow 1 Naira tolerance
    //     throw new Error("Price tampering detected");
    //   }
    // } catch (error) {
    //   console.error("Price verification error:", error);
    //   return res.json({ success: false, message: "Order validation failed" });
    // }

    // ===== RESOLVE DISCOUNT =====
    const discount = discountCode
      ? await resolveDiscountForCode({ code: discountCode, items })
      : null;
    const discountAmount = discount?.success ? discount.discountAmount : 0;
    const discountCampaignId = discount?.success ? discount.campaignId : null;
    const resolvedCode = discount?.success ? discount.code : null;
    const resolvedPreDiscountAmount =
      Number(preDiscountAmount) ||
      Number(amount) + Number(submittedDiscountAmount || 0) ||
      verifiedAmount + discountAmount;
    const expectedPayableAmount = Math.max(
      resolvedPreDiscountAmount - discountAmount,
      0,
    );

    if (paymentData.amount < Math.round(expectedPayableAmount * 100)) {
      console.error(
        `Underpayment detected after discount resolution! Expected: ${Math.round(expectedPayableAmount * 100)}, Paid: ${paymentData.amount}`,
      );
      return res.json({
        success: false,
        message: "Payment amount mismatch. Please contact support.",
      });
    }

    // ===== CREATE ORDER =====
    const orderData = {
      userId: isGuest ? null : userId,
      items,
      address,
      amount: verifiedAmount,
      discountCode: resolvedCode,
      discountAmount,
      discountCampaignId,
      paymentMethod: "paystack",
      payment: true,
      paymentReference: reference,
      paystackData: {
        reference: paymentData.reference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        transactionDate: paymentData.transaction_date,
        channel: paymentData.channel,
        metadata: paymentData.metadata || null, // ← store metadata as fallback
      },
      date: Date.now(),
      isGuest: isGuest,
      guestEmail: isGuest ? address.email : null,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    if (resolvedCode) {
      try {
        await subscriberModel.findOneAndUpdate(
          { code: resolvedCode },
          { status: "used", usedAt: new Date() },
        );
      } catch (discountError) {
        console.error(
          "Failed to mark discount code as used:",
          discountError.message,
        );
      }
    }

    // Only clear cart for authenticated users
    if (!isGuest && userId) {
      try {
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
      } catch (error) {
        console.error("Error clearing cart:", error.message);
        // Don't fail the order if cart clearing fails
      }
    }

    // Send confirmation email (non-blocking)
    try {
      const emailTo = isGuest ? address.email : null;
      if (emailTo) {
        // For guests, use address email directly
        await sendOrderConfirmationEmail({ to: emailTo, order: newOrder });
      } else if (!isGuest && userId) {
        // For authenticated users, get email from user model
        const user = await userModel.findById(userId);
        if (user?.email) {
          await sendOrderConfirmationEmail({ to: user.email, order: newOrder });
        }
      }
    } catch (emailError) {
      console.error("Email error:", emailError.message);
      // Don't fail the order if email fails
    }

    // Return success immediately
    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });

    // Send admin notification in background
    try {
      await sendNewOrderAdminNotification({ order: newOrder });
    } catch (error) {
      console.error("Failed to send admin notification:", error.message);
    }
  } catch (error) {
    console.error("Order processing error:", error);

    if (error.code === 11000) {
      const existingOrder = await orderModel.findOne({
        paymentReference: req.body.reference,
      });
      return res.json({
        success: true,
        message: "Order already processed",
        orderId: existingOrder?._id,
        isDuplicate: true,
      });
    }

    // Check if it's a network error
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.json({
        success: false,
        message:
          "Network error. Please contact support if payment was deducted.",
        reference: req.body.reference,
      });
    }

    res.json({
      success: false,
      message:
        "An error occurred. Please contact support if payment was deducted.",
    });
  }
};

// Getting all orders for admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

// User Order Data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

// Update order status from admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order ID and status required",
      });
    }

    const validStatuses = [
      "Order Placed",
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "NEEDS_RECOVERY",
    ];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.json({ success: false, message: "Invalid status" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });

    // Send status update email (non-blocking)
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
    } catch (emailError) {
      console.error("Email error:", emailError.message);
    }

    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Update status error:", error);
    res.json({ success: false, message: "Failed to update status" });
  }
};

const paystackWebhook = async (req, res) => {
  try {
    // Signature verification
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body) //raw buffer
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.warn("Webhook: signature verification failed");
      return res.status(401).send("Unauthorized");
    }

    // parse raw body
    const event = JSON.parse(req.body);
    const eventType = event.event;

    // Event Filtering
    // Handle charge.success and transfer.success
    if (!["charge.success", "transfer.success"].includes(eventType)) {
      return res.sendStatus(200);
    }

    const paymentData = event.data;
    const reference = paymentData.reference;

    if (!reference) {
      console.error("Webhook: missing reference in payload");
      return res.sendStatus(200);
    }

    // Transfer.success refund guard
    if (eventType === "transfer.success") {
      if (paymentData.recipient?.type === "nuban") {
        console.log(
          `Webhook: outgoing transfer detected, ignoring. Reference: ${reference}`,
        );
        return res.sendStatus(200);
      }
    }

    // IDEMPOTENCY CHECK
    const existingOrder = await orderModel.findOne({
      paymentReference: reference,
    });

    if (existingOrder) {
      console.log(`Webhook: order already exists for reference ${reference}`);
      return res.sendStatus(200);
    }

    const verifiedAmount = paymentData.amount / 100;
    const customerEmail =
      paymentData.customer?.email ||
      paymentData.metadata?.address?.email ||
      null;

    // METADATA CHECK
    const metadata = paymentData.metadata;
    const hasValidMetadata =
      metadata?.items &&
      Array.isArray(metadata.items) &&
      metadata.items.length > 0 &&
      metadata?.address?.firstName &&
      metadata?.address?.email;

    if (!hasValidMetadata) {
      // payment confirmed but can't reconstruct the order automatically
      // save recovery record to show on admin panel for manual completions
      console.error(
        `Webhook: charge.success with missing/invalid metadata. Reference: ${reference}, Amount: ${verifiedAmount}, Email: ${customerEmail}`,
      );

      try {
        const recoveryOrder = new orderModel({
          userId: null,
          items: [],
          address: {
            email: customerEmail || "unknown",
            firstName: paymentData.customer?.first_name || "Unknown",
            lastName: paymentData.customer?.last_name || "",
          },
          amount: verifiedAmount,
          paymentMethod: "paystack",
          payment: true,
          paymentReference: reference,
          status: "NEEDS_RECOVERY", // Flags it clearly on admin panel
          paystackData: {
            reference: paymentData.reference,
            amount: paymentData.amount,
            currency: paymentData.currency,
            transactionDate: paymentData.transaction_date,
            channel: paymentData.channel,
            metadata: paymentData.metadata || null,
          },
          date: Date.now(),
          isGuest: true,
          guestEmail: customerEmail,
        });

        await recoveryOrder.save();
        console.log(`Webhook: recovery order saved for reference ${reference}`);

        // Responsd before email
        res.sendStatus(200);

        // Alert admin to follow up manually
        try {
          await sendNewOrderAdminNotification({
            order: recoveryOrder,
            isRecovery: true,
          });
        } catch (adminEmailError) {
          console.error(
            "Webhook: recovery admin notification failed:",
            adminEmailError.message,
          );
        }
      } catch (recoveryError) {
        if (recoveryError.code === 11000) {
          console.log(
            `Webhook: recovery order already exists for reference ${reference}`,
          );
        } else {
          console.error(
            "Webhook: recovery order save failed:",
            recoveryError.message,
          );
        }
      }

      // return res.sendStatus(200);
    }

    const webhookDiscount = metadata.discountCode
      ? await resolveDiscountForCode({
          code: metadata.discountCode,
          items: metadata.items,
        })
      : null;
    const webhookDiscountAmount = webhookDiscount?.success
      ? webhookDiscount.discountAmount
      : 0;
    const webhookDiscountCode = webhookDiscount?.success
      ? webhookDiscount.code
      : null;
    const webhookDiscountCampaignId = webhookDiscount?.success
      ? webhookDiscount.campaignId
      : null;

    // CREATE FULL ORDER FROM METADATA
    const metadataDiscountCode = isDiscountWaitlistEnabled
      ? metadata.discountCode || null
      : null;
    const metadataDiscountAmount = isDiscountWaitlistEnabled
      ? metadata.discountAmount || 0
      : 0;

    const orderData = {
      userId: metadata.isGuest ? null : metadata.userId || null,
      items: metadata.items,
      address: metadata.address,
      amount: verifiedAmount,
      discountCode: webhookDiscountCode,
      discountAmount: webhookDiscountAmount,
      discountCampaignId: webhookDiscountCampaignId,
      paymentMethod: "paystack",
      payment: true,
      paymentReference: reference,
      paystackData: {
        reference: paymentData.reference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        transactionDate: paymentData.transaction_date,
        channel: paymentData.channel,
        metadata: paymentData.metadata,
      },
      date: Date.now(),
      isGuest: metadata.isGuest ?? true,
      guestEmail: metadata.address?.email || customerEmail || null,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ====== MARK DISCOUNT CODE AS USED ======
    if (webhookDiscountCode) {
      try {
        await subscriberModel.findOneAndUpdate(
          { code: webhookDiscountCode },
          { status: "used", usedAt: new Date() },
        );
      } catch (dsicountError) {
        console.error(
          "webhook: failed to mark discount code as used:",
          dsicountError.message,
        );
      }
    }

    console.log(
      `Webhook: order created successfully for reference ${reference}`,
    );

    // response before emails
    res.sendStatus(200);

    // Send confirmation email
    const emailTo = metadata.address?.email || customerEmail;
    try {
      if (emailTo) {
        await sendOrderConfirmationEmail({ to: emailTo, order: newOrder });
      }
    } catch (emailError) {
      console.error("Webhook: confirmation email failed:", emailError.message);
      // Order is saved — email failure is non-critical
    }

    // ADMIN Notification
    try {
      await sendNewOrderAdminNotification({ order: newOrder });
    } catch (adminEmailError) {
      console.error(
        "Webhook: admin notification failed:",
        adminEmailError.message,
      );
    }

    // Clear cart for authenticated users
    if (!metadata.isGuest && metadata.userId) {
      try {
        await userModel.findByIdAndUpdate(metadata.userId, { cartData: {} });
      } catch (cartError) {
        console.error("Webhook: cart clear failed:", cartError.message);
      }
    }

    // res.sendStatus(200);
  } catch (error) {
    // Duplicate key - race between webhook and placeOrderPaystack
    // Both tried to save same reference at the same time
    if (error.code === 11000) {
      console.log("Webhook: duplicate key — order already saved concurrently");
      return res.sendStatus(200);
    }

    console.error("Webhook: unhandled error:", error.message);
    // Return 500 so Paystack retries for genuine unexpected failures
    res.sendStatus(500);
  }
};

export {
  placeOrder,
  placeOrderPaystack,
  allOrders,
  userOrders,
  updateStatus,
  paystackWebhook,
};
