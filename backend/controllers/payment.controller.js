import Razorpay from "razorpay";
import Payment from "../models/Payment.schema.js";
import Patient from "../models/Patient.schema.js";
import { practitioner_prices } from "../utils/test_priceListing.js";
import { createHmac } from "crypto";

const paymentController = {
  addPayment: async (req, res) => {
    try {
      console.log("req.user is ", req.user);
      const UserId = req.user.UserId;
      if (!UserId) {
        return res.status(400).json({ error: "UserId is required" });
      }
      const patientData = await Patient.findOne({ UserId });
      if (!patientData) {
        return res.status(404).json({ error: "Patient not found" });
      }
      const { currency, DocPulseId, Coupon, lid: locationId, t: datetime, pid: practitionerId, v: visitTypeName } = req.body;

      console.log("DATA FROM USER: ", req.body);
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      console.log("currentcy and docpulseid and userid is ", currency, DocPulseId, UserId);
      if (!currency || !DocPulseId || !UserId) {
        return res
          .status(400)
          .json({ error: "Currency/DocPulseId/UserId is required" });
      }

      const practitioner = practitioner_prices.find(
        (practitioner) => practitioner.DocPulseId === DocPulseId
      );
      if (!practitioner) {
        return res.status(404).json({ error: "Practitioner not found" });
      }

      let discount = 0;
      if (Coupon === "MST-15") {
        discount = 15;
      }
      const price = practitioner.Price;
      const gst = practitioner.GST;

      const total_amount = Number(price - (discount / 100) * price + gst);
      if (total_amount < 0) {
        return res.status(400).json({ error: "Total amount cannot be negative" });
      }

      const endDatetime = datetime.split('T')[0] + 'T23:59+0530';

      const queryParams = new URLSearchParams({
        apiKey: "agxzfm1tZGNvbm5lY3RyHAsSD0RiVGhpcmRQYXJ0eVJlZxiAgIiaqtqsCww",
        locationId,
        datetime,
        endDatetime: endDatetime,
        practitionerId,
      });

      let queryString = queryParams.toString();
      queryString = queryString.replace(/\+/g, "%2B");

      const availableSlotsUrl = `https://mmdconnect.appspot.com/extapi/Slot/list?${queryString}`

      const slotResponse = await fetch(availableSlotsUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })

      const slotData = await slotResponse.json();
      console.log("Slot API response:", slotData);

      const availableSlots = JSON.parse(slotData?.data || "[]");

      const slotAvailable = availableSlots.some(
        (slot) => slot.dateTime === datetime
      );

      if (!slotAvailable) {
        console.log("Selected slot is not available, Try Again");
        return res.status(400).json({ error: "Selected slot is not available, Try Again" });
      }

      console.log("total amount is ", total_amount);
      const options = {
        amount: Math.round(total_amount * 100),
        currency,
        receipt: `RECEPT_${Date.now()}`,
      };
      console.log("options are ", options);

      const order = await instance.orders.create(options);
      console.log("order is ", order);
      const payment = await Payment.create({
        DocPulseId,
        UserId,
        Amount: price,
        GST: gst,
        currency,
        status: "pending",
        razorpay_order_id: order.id,
        razorpay_payment_id: null,
        razorpay_signature: null,
      });

      console.log("Payment Created Successfully =>>", payment);

      res.status(200).json({ message: "Order Created Successfully", order });
    } catch (error) {
      console.log("Errro", error)
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Payment details are missing" });
      }
      const payment = await Payment.findOne({ razorpay_order_id });
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
        .update(body.toString())
        .digest("hex");

      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.updatedAt = Date.now();
      if (razorpay_signature === expectedSignature) {
        payment.status = "completed";
        await payment.save();
        return res
          .status(200)
          .json({ message: "Payment verified successfully", status: true });
      } else {
        payment.status = "failed";
        await payment.save();
        return res
          .status(400)
          .json({ message: "Payment verification failed", status: false });
      }
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Internal Server Error",
          error: err.message,
          status: false,
        });
    }
  },
};

export default paymentController;
