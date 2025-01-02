import mongoose from "mongoose";

const DisciplineSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
  ],

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  tests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
  ],
});

export default mongoose.model("Discipline", DisciplineSchema);
