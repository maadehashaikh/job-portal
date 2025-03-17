import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["applicant", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // URL to the resume file
      resumeOriginalname: { type: String },
      company: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // generating realtion bewteen user and comapny name in which user is applying
      profilePhoto: { type: String, default: "" }, // URL to the profile photo
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
