import { Schema, model } from "mongoose";

const schema = new Schema({
  DocPulseId: {
    type: String,
    required: true,
    unique: true,
  },
  Image_Url: {
    type: String,
  },
  FullName: {
    type: String,
    required: true,
  },
  Designation: {
    type: String,
    required: true,
  },
  Education: {
    type: [String],
  },
  Experience: {
    type: String,
  },
  Languages: {
    type: [String],
  },
  About: {
    type: String,
  },
  ConcernsOfClient: {
    type: [String],
  },
  ExpertiesApproach: {
    type: [String],
  },
  Specialization: {
    type: [String],
  },
  Therapies: {
    type: [String],
  },
  AffiliationsAndCertifications: {
    type: [String],
  },
  HelpProvide: {
    type: [String],
  },
  ConcernAddressed: {
    type: [String],
  },
  Department: {
    type: String,
  },
  Session_Price: {
    type: Number,
  },
  GST: {
    type: Number,
  },
  Location: {
    type: String,
  },
  area: {
    type: String,
  },
  Email: {
    type: String,
  }
});

const Practitioner = model("Practitioner", schema);

export default Practitioner;
