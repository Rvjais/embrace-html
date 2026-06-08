import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  DocPulseId: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  GST: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  razorpay_order_id: {
    type: String,
  },
  couponCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = model("Payment", paymentSchema);

export default Payment;
