import Patient from "../models/Patient.schema.js";
import Practitioner from "../models/Practitioner.schema.js";
import { uploadExcelFileToAzure } from "../utils/blobUpload.js";
import Appointment from "../models/Appointment.schema.js";
import { randomUUID } from "crypto";
import { getPractitioners, getDepartments, getLocations as getCachedLocations } from "../db.connection.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, "..", "..", "embrace_clone", "practitioner-images");

const userController = {
  fetchDepartment: async (req, res) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch("https://mmdconnect.appspot.com/extapi/Department/list?apiKey=agxzfm1tZGNvbm5lY3RyHAsSD0RiVGhpcmRQYXJ0eVJlZxiAgIiaqtqsCww&locationId=47033", { signal: controller.signal });
      clearTimeout(timeout);
      const data = await resp.json();
      console.log("department api response ", data);
      if (data.resultCode === "notAuthorised" || data.resultCode === "error") {
        throw new Error("DocPulse API not authorised");
      }
      return res.status(200).json({ message: "Success", data: data?.data || "[]" });
    }
    catch (error) {
      console.log("DocPulse department API failed, using cached data:", error.message);
      let departments = getDepartments();
      // Use friendly names that the frontend filter tab UI expects
      const friendlyNames = {
        "Clinical Psychology": "Clinical Psychologist",
        "Occupational Therapy": "Occupational Therapist",
      };
      departments = departments.map(d => friendlyNames[d] || d).sort();
      return res.status(200).json({ message: "Success", data: JSON.stringify(departments) });
    }
  },

  fetchDoctorSlots: async (req, res) => {
    const { date, practitionerId, locationId, datetime, endDatetime } = req.query;
    try {

      console.log("fetchDoctorSlots query params ", req.query);

      const queryParams = new URLSearchParams({
        apiKey: "agxzfm1tZGNvbm5lY3RyHAsSD0RiVGhpcmRQYXJ0eVJlZxiAgIiaqtqsCww",
        locationId: locationId || "47033",
        datetime: datetime || date || "",
        endDatetime,
        practitionerId,
      })

      let queryString = queryParams.toString();
      queryString = queryString.replace(/\+/g, "%2B");

      console.log("fetchDoctorSlots query params string ", queryString);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`https://mmdconnect.appspot.com/extapi/Slot/list?${queryString}`, { signal: controller.signal });
      clearTimeout(timeout);

      const data = await response.json();
      console.log("doctor slots api response ", data);

      if (data.resultCode !== "notAuthorised" && data.resultCode !== "error") {
        const docpulseSlots = JSON.parse(data?.data || "[]");
        if (docpulseSlots.length > 0) {
          return res.status(200).json({ data: docpulseSlots, slots: [] });
        }
      }
      throw new Error("DocPulse slots unavailable");

    } catch (error) {
      console.log("error in fetching doctor slots, generating mock slots:", error.message);
      // Generate mock time slots for the given date
      const targetDate = date ? new Date(date) : new Date();
      if (isNaN(targetDate.getTime())) {
        return res.status(200).json({ data: [], slots: [] });
      }

      const day = targetDate.getDay();
      // No slots on Sunday (0) or Saturday (6)
      if (day === 0 || day === 6) {
        return res.status(200).json({ data: [], slots: [] });
      }

      const slots = [];
      const baseDate = targetDate.toISOString().split("T")[0];
      // Generate slots from 9:00 AM to 5:00 PM, every 30 minutes
      for (let hour = 9; hour <= 16; hour++) {
        for (let min = 0; min < 60; min += 30) {
          const start = `${baseDate}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`;
          const endHour = min === 30 ? hour + 1 : hour;
          const endMin = min === 30 ? 0 : min + 30;
          const end = `${baseDate}T${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}:00`;
          slots.push({
            slotStartTime: start,
            slotEndTime: end,
            practitionerId: practitionerId || "",
            locationId: locationId || "47033",
            available: true,
          });
        }
      }
      return res.status(200).json({ data: slots, slots });
    }
  },

  fetchPractionerList: async (req, res) => {
    try {
      const {
        locationId,
        department,
        visitTypeName
      } = req.query;

      const queryParams = new URLSearchParams({
        apiKey: "agxzfm1tZGNvbm5lY3RyHAsSD0RiVGhpcmRQYXJ0eVJlZxiAgIiaqtqsCww",
        locationId: locationId || "47033",
        department: department || "",
        visitTypeName: visitTypeName || "",
      })

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`https://mmdconnect.appspot.com/extapi/Practitioner/list?${queryParams.toString()}`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json();
      console.log("practioner list api response ", data);

      if (data.resultCode === "notAuthorised" || data.resultCode === "error") {
        throw new Error("DocPulse API not authorised");
      }

      const parsed = JSON.parse(data?.data || "[]");
      if (parsed.length > 0) {
        return res.status(200).json({ practitioners: parsed });
      }
      throw new Error("Empty data from DocPulse");
    } catch (error) {
      console.log("DocPulse practitioner fetch failed, using cached data:", error.message);
      let cached = getPractitioners();
      if (req.query.department) {
        const dept = req.query.department.toLowerCase();
        // Map common UI filter names to actual stored department names
        const deptMap = {
          "clinical psychologist": "Clinical Psychology",
          "occupational therapist": "Occupational Therapy",
        };
        const mappedDept = (deptMap[dept] || req.query.department).toLowerCase();
        cached = cached.filter(p => p.Department?.toLowerCase() === mappedDept);
      }
      const mapped = cached.map(p => {
        const imgUrl = p.Image_Url || "";
        // Only include Image_Url if the local file exists
        const filename = imgUrl ? imgUrl.split("/").pop() : "";
        const localPath = filename ? path.join(imageDir, filename) : "";
        const validImg = localPath && fs.existsSync(localPath) ? imgUrl : "";
        return {
          id: p.DocPulseId,
          DocPulseId: p.DocPulseId,
          fullName: p.FullName,
          FullName: p.FullName,
          designation: p.Designation || p.Department,
          Designation: p.Designation || p.Department,
          department: p.Department,
          Department: p.Department,
          education: p.Education || [],
          Education: p.Education || [],
          experience: p.Experience || "",
          Experience: p.Experience || "",
          languages: p.Languages || [],
          Languages: p.Languages || [],
          imageUrl: validImg,
          Image_Url: validImg,
          sessionPrice: p.Session_Price || 0,
          Session_Price: p.Session_Price || 0,
          gst: p.GST || 0,
          GST: p.GST || 0,
          area: p.area || "",
          _id: p.DocPulseId + "_" + Date.now(),
        };
      });
      return res.status(200).json({ practitioners: mapped });
    }
  },

  addPractitioner: async (req, res) => {
    try {
      const {
        DocPulseId,
        FullName,
        Designation,
        Department,
        Education,
        Experience,
        Languages,
        Session_Price,
      } = req.body;
      if (
        !DocPulseId ||
        !FullName ||
        !Designation ||
        !Department ||
        !Education ||
        !Experience ||
        !Languages ||
        !Session_Price
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const practitioner = await Practitioner.create(req.body);
      res.status(201).json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPractitioners: async (req, res) => {
    try {
      const { id } = req.query;
      const cached = getPractitioners().find(p => p.DocPulseId === id);
      if (!cached) return res.status(404).json({ error: "Practitioner not found" });
      res.status(200).json({ practitioner: { ...cached, _id: cached.DocPulseId + "_" + Date.now() } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addImagePractitiioner: async (req, res) => {
    try {
      const { id } = req.body;
      const file = req.file;
      const img_Url = await uploadExcelFileToAzure(
        file.buffer,
        file.originalname
      );
      const practitioner = await Practitioner.findOneAndUpdate(
        { DocPulseId: id?.toString() },
        { Image_Url: img_Url },
        { new: true }
      );
      if (!practitioner) {
        return res.status(404).json({ error: "Practitioner not found" });
      }
      res.status(200).json({ message: "Image uploaded successfully", img_Url });
    } catch (err) {
      console.log("Error in addImagePractitiioner", err);
      res.status(500).json({ error: err.message });
    }
  },

  getPractitionsList: async (req, res) => {
    try {
      const { name, location } = req.query;
      let cached = getPractitioners();
      if (name) {
        const n = name.toLowerCase();
        const deptMap = {
          "clinical psychologist": "clinical psychology",
          "occupational therapist": "occupational therapy",
        };
        const mapped = (deptMap[n] || n).toLowerCase();
        cached = cached.filter(p => p.Department?.toLowerCase() === mapped);
      }
      if (location) {
        const loc = location.toLowerCase();
        cached = cached.filter(p => p.area?.toLowerCase() === loc);
      }
      return res.status(200).json({ practitioners: cached });
    } catch (err) {
      console.log("Error Occured: ", err);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  addPatient: async (req, res) => {
    try {
      let { Fullname, Phone, Email, Emergency_Contact } = req.body;

      if (!Fullname || !Phone || !Email || !Emergency_Contact) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (Phone.length !== 10) {
        return res
          .status(400)
          .json({ error: "Phone number should be 10 digits" });
      }

      const patientExists = await Patient.findOne({ Phone });
      if (!patientExists) {
        return res.status(400).json({ error: "Patient does not exist" });
      }

      console.log("patient exist with ", patientExists);
      if (Emergency_Contact.length !== 10) {
        return res
          .status(400)
          .json({ error: "Emergency Contact number should be 10 digits" });
      }

      patientExists.Fullname = Fullname;
      patientExists.Age = req.body.Age;
      patientExists.Email = Email;
      patientExists.Emergency_Contact = Emergency_Contact;
      patientExists.Guardian_Details = req.body.Guardian_Details;
      patientExists.Concerns = req.body.Concerns;

      console.log("patient exists is ", patientExists);
      await patientExists.save();

      res.status(201).json(patientExists);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getPractitioner_Patient: async (req, res) => {
    try {
      const { DocPulseId } = req.query;
      if (!DocPulseId) {
        return res.status(400).json({ error: "DocPulseId is required" });
      }
      const practitioners = await Practitioner.findOne(
        { DocPulseId },
        { _id: 1 }
      ).maxTimeMS(10000);
      if (!practitioners) {
        return res.status(404).json({ error: "Practitioner not found" });
      }
      const patients = await Patient.find({ DocPulseId }).maxTimeMS(10000);
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getPractioners_Filter: async (req, res) => {
    try {
      const { language, page } = req.query;
      let cached = getPractitioners();
      if (language) {
        const lang = language.toLowerCase();
        cached = cached.filter(p => p.Languages?.some(l => l.toLowerCase().includes(lang)));
      }
      const pg = Math.max(parseInt(page) || 1, 1);
      const start = (pg - 1) * 10;
      return res.status(200).json(cached.slice(start, start + 10));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  testAppointmentApi: async (req, res) => {
    try {
      const user = req.user.UserId;
      if (!user) {
        return res.status(400).json({ error: "UserId is required" });
      }
      const response = await fetch(
        `https://mmdconnect.appspot.com/extapi/Appointment/create?apiKey=agxzfm1tZGNvbm5lY3RyHAsSD0RiVGhpcmRQYXJ0eVJlZxiAgIiaqtqsCww`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        }
      );

      let data;
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log(data);

      if (data.resultCode === "success") {
        const patientData = await Patient.findOne({ UserId: user });
        if (!patientData) {
          return res.status(404).json({ message: "Patient not found" });
        }
        const appointmentId = randomUUID();
        patientData.AppointmentIds.push({
          AppointmentId: appointmentId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        console.log("session mode is ", req.body.sessionMode)
        const appointment = new Appointment({
          PatientId: user,
          DoctorId: req.body.practitionerId,
          AppointmentStartDate: req.body.dateTime,
          AppointmentEndDate: new Date(new Date(req.body.dateTime).getTime() + 60 * 60 * 1000),
          SessionMode: req.body.sessionMode || "Video",
          AppointmentId: appointmentId,
          LocationId: req.body.locationId,
        });

        await Promise.all([
          patientData.save(),
          appointment.save(),
        ]).then(() => {
          console.log("Appointment and Patient data updated successfully");
        }).catch((error) => {
          console.error("Error updating appointment or patient data:", error);
        });
        res.status(200).json({ message: "Success", data });
      }
      else {
        return res.status(404).json({
          message: "Response failed",
          status_code: response.status,
          data,
        });
      }
    } catch (error) {
      console.log("my error: ", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getLocations: async (req, res) => {
    try {
      const locations = getCachedLocations();
      let locationList = [];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const locResp = await fetch(
          `https://mmdconnect.appspot.com/extapi/Location/list?apiKey=${process.env.API_KEY}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        const locData = await locResp.json();
        locationList = JSON.parse(locData.data || "[]");
      } catch (e) {
        console.log("DocPulse location fetch failed:", e.message);
      }
      res.status(200).json({ message: "Success", data: locations || [], locations: locationList });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};

export default userController;
