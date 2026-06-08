import jwt from "jsonwebtoken";
import Patient from "../models/Patient.schema.js";
import { randomUUID } from "crypto";

const authController = {
  sendOtpMobile: async (req, res) => {
    try {
      const { mobile } = req.body;
      const AUTHKEY = process.env.MSG91_AUTH_KEY;
      const SENDER_ID = process.env.MSG91_SENDER_ID;
      const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
      const url = `https://control.msg91.com/api/v5/otp?otp_expiry=10080&template_id=${TEMPLATE_ID}&mobile=${mobile}&authkey=${AUTHKEY}&realTimeResponse=1`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON",
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("An Error Occured: ", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        success: false,
      });
    }
  },

  verifyOtpMobile: async (req, res) => {
    try {
      let { mobile, otp } = req.body;
      const AUTHKEY = process.env.MSG91_AUTH_KEY;
      const url = `https://control.msg91.com/api/v5/otp/verify?mobile=${mobile}&otp=${otp}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { authkey: AUTHKEY },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }

      if (data.type === "error") {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
          data: data,
        });
      }

      mobile = mobile.slice(-10);
      if (mobile.length !== 10) {
        return res.status(400).json({ error: "Mobile number should be 10 digits" });
      }
      let patient = await Patient.findOne({ Phone: mobile });
      let patientData;
      if (!patient) {
        patientData = new Patient({
          UserId: randomUUID(),
          Phone: mobile
        })
        patient = await patientData.save();
      }

      const token = jwt.sign({ UserId: patient.UserId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const isLocal = process.env.NODE_ENV !== "production" || req.get("host")?.includes("localhost");
      res.cookie("token", token, {
        ...(isLocal ? {} : { domain: ".embracelives.com" }),
        path: "/",
        httpOnly: true,
        secure: !isLocal,
        sameSite: isLocal ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("An Error Occured: ", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        success: false,
      });
    }
  },

  resenOtpMobile: async (req, res) => {
    try {
      const { mobile } = req.body;
      const AUTHKEY = process.env.MSG91_AUTH_KEY;
      const url = `https://control.msg91.com/api/v5/otp/retry?authkey=${AUTHKEY}&retrytype=text&mobile=${mobile}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }
      if (data.type === "error") {
        return res.status(400).json({
          success: false,
          message: "Failed to resend OTP",
          data: data,
        });
      }
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("An Error Occured: ", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        success: false,
      });
    }
  },
};

export default authController;
