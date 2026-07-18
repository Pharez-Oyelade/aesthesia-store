import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // Optional for guest orders
  items: { type: Array, required: true }, // Each item will include color if selected
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  paymentReference: { type: String, unique: true, sparse: true },
  paystackData: { type: Object },
  date: { type: Number, required: true },
  isGuest: { type: Boolean, required: true, default: false }, // Flag for guest orders
  guestEmail: { type: String, required: false }, // Store guest email for easy lookup
  discountCode: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },
  discountCampaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    default: null,
  },
  visitorId: { type: String, default: null, index: true },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
