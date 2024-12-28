import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  discipline: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  questionnaires: {
    type: Array,
    default: [],
  },

  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
});

export default mongoose.model("user", userSchema);
