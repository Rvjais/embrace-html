import mongoose from "mongoose";
const { connect, set } = mongoose;

set("bufferTimeoutMS", 30000);

let practitionerCache = null;

export const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    console.log("⚠️  Continuing without database - some features will be unavailable");
  }
};

export const refreshPractitionerCache = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      practitionerCache = { practitioners: [], departments: [], locations: [] };
      return;
    }
    const practitioners = await db.collection("practitioners").find({}).project({
      DocPulseId: 1, FullName: 1, Department: 1, Education: 1,
      Experience: 1, Languages: 1, Image_Url: 1, Session_Price: 1,
      GST: 1, area: 1, Designation: 1, About: 1, ConcernsOfClient: 1,
      ExpertiesApproach: 1, Specialization: 1, Therapies: 1,
      AffiliationsAndCertifications: 1, HelpProvide: 1, ConcernAddressed: 1,
      Location: 1, Email: 1, _id: 0
    }).toArray();

    const departments = [...new Set(practitioners.map(p => p.Department).filter(Boolean))];
    const locations = [...new Set(practitioners.map(p => p.area).filter(Boolean))];

    practitionerCache = { practitioners, departments, locations };
    console.log(`✅ Cached ${practitioners.length} practitioners, ${departments.length} departments, ${locations.length} locations`);
  } catch (error) {
    console.log("⚠️  Failed to cache practitioner data:", error.message);
    practitionerCache = { practitioners: [], departments: [], locations: [] };
  }
};

export const getPractitioners = () => practitionerCache?.practitioners || [];
export const getDepartments = () => practitionerCache?.departments || [];
export const getLocations = () => practitionerCache?.locations || [];
