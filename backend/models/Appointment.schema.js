import { Schema, model } from 'mongoose';

const AppointmentSchema = new Schema({
  PatientId: {
    type: String,
    required: true
  },
  DoctorId: {
    type: String,
    required: true
  },
  AppointmentStartDate: {
    type: Date,
    required: true,
  },
  SessionMode: {
    type: String,
    enum: ['In-Person', 'Video'],
    required: true
  },
  AppointmentId: {
    type: String,
    required: true
  },
  LocationId: {
    type: String,
    required: true
  },
  GoogleCalendarEventId: {
    type: String,
  },
  GoogleCalendarLink: {
    type: String,
  }
},
  {
    timestamps: true,
  }
);

const Appointment = model('Appointment', AppointmentSchema);
export default Appointment;
