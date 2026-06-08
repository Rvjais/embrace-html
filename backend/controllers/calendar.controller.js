import { google } from 'googleapis';
import Patient from "../models/Patient.schema.js"
import Appointment from '../models/Appointment.schema.js';
import Practitioner from "../models/Practitioner.schema.js";
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const calendar = google.calendar('v3');

const calendarController = {
  getCalendar: async (req, res) => {
    console.log("Calendar booking initiated");

    let jwtClient;
    try {
      const serviceAccountPath = path.resolve(__dirname, '..', process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './config/calendar-service-account.json');
      const serviceAccountKey = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

      jwtClient = new google.auth.JWT({
        email: serviceAccountKey.client_email,
        key: serviceAccountKey.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar'],
        subject: 'techsupport@embracelives.com'
      });
    } catch (e) {
      console.log("Service account not available, skipping calendar booking");
    }

    try {
      const user = req.user.UserId;
      const patientData = await Patient.findOne({ UserId: user });
      if (!patientData) {
        return res.status(404).json({ message: "Patient not found" });
      }
      console.log("patient data is ", patientData)

      const recentAppointment = patientData.AppointmentIds[patientData.AppointmentIds.length - 1];
      console.log("recent appointments are ", recentAppointment)

      if (!recentAppointment || recentAppointment.CalendarBooked) {
        return res.status(400).json({ message: "Recent appointment not found or calendar already booked" });
      }

      const appointmentData = await Appointment.findOne({ AppointmentId: recentAppointment.AppointmentId });
      console.log("appointment data is ", appointmentData)
      if (!appointmentData) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const doctorId = appointmentData.DoctorId;
      console.log("doctorId is ", doctorId)
      const doctorData = await Practitioner.findOne({ DocPulseId: doctorId });
      if (!doctorData) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const doctorEmail = doctorData.Email;
      console.log("doctorEmail is ", doctorEmail)

      const event = {
        summary: `${appointmentData.SessionMode} Consultation with ${doctorData.FullName}`,
        description: `Your ${appointmentData.SessionMode} consultation is confirmed with ${doctorData.FullName}  ${appointmentData.SessionMode === "Video" ? "." : "at https://maps.app.goo.gl/yscuTccxctFoDeCg6"}.`,
        start: {
          dateTime: appointmentData.AppointmentStartDate,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(new Date(appointmentData.AppointmentStartDate).getTime() + 60 * 60 * 1000),
          timeZone: 'Asia/Kolkata',
        },
        attendees: [
          { email: patientData.Email },
          { email: doctorEmail },
        ],
      };

      if (appointmentData.SessionMode === 'Video') {
        event.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            },
          }
        }
      }
      console.log("event is ", event)

      if (jwtClient) {
        calendar.events.insert({
          auth: jwtClient,
          calendarId: 'techsupport@embracelives.com',
          resource: event,
          conferenceDataVersion: appointmentData.SessionMode === 'Video' ? 1 : 0,
          sendUpdates: 'all',
        }, async (err, response) => {
          if (err) return console.error('Error creating event:', err);
          console.log('Event created:', response.data.htmlLink);
          recentAppointment.CalendarBooked = true;
          appointmentData.GoogleCalendarEventId = response.data.id;
          if (appointmentData.SessionMode === "Video") {
            appointmentData.GoogleCalendarEventId = response.data.id;
            appointmentData.GoogleMeetLink = response.data.conferenceData.entryPoints?.[0]?.uri || null;
          }
          Promise.all([
            patientData.save(),
            appointmentData.save()
          ]).then(() => {
            console.log("Appointment and Patient data updated successfully");
          }).catch((error) => {
            console.error("Error updating appointment or patient data:", error);
          });
        });
      } else {
        recentAppointment.CalendarBooked = true;
        await Promise.all([patientData.save(), appointmentData.save()]);
      }

      let mode;
      if (appointmentData.SessionMode === 'Video') {
        mode = 1;
      } else {
        mode = 0;
      }

      return res.redirect(`/appointment/confirmation?pid=${doctorData.DocPulseId}&lid=${appointmentData.LocationId}&t=${appointmentData.AppointmentStartDate.toISOString()}&v=${mode}`);
    } catch (error) {
      console.error("Error in calendar booking:", error);
      return res.status(500).send("Calendar Booking Error");
    }
  },
};

export default calendarController;
