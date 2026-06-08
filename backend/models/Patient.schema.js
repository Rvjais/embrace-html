import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const patientSchema = new Schema({
  UserId: {
    type: String,
  },
  Fullname: {
    type: String,
  },
  Age: {
    type: Number,
  },
  Phone: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
  },
  Emergency_Contact: {
    type: String,
  },
  Guardian_Details: {
    type: String,
  },
  Concerns: {
    type: String,
  },
  Coupons: [
    {
      CouponId: {
        type: String,
        default: randomUUID(),
      },
      CouponCode: {
        type: String,
      },
      Discount: {
        type: Number,
      },
    }
  ],
  AppointmentIds: [
    {
      AppointmentId: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      CalendarBooked: {
        type: Boolean,
        default: false,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = model("Patient", patientSchema);
export default Patient;
