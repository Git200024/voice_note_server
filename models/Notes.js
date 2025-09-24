import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    audioUrl: { type: String, default: "" },
    transcript: { type: String, required: true },
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Notes", noteSchema);
