import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicationImageUrl: {
    type: String, // applicant's photo
  },
  govtIdUrl: {
    type: String,
    required: true, // government ID proof image
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
