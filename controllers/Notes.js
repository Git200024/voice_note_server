import fs from "fs";
import Notes from "../models/Notes.js";
import multer from "multer";
import path from "path";
import {
  summarizeWithGemini,
  transcribeWithGemini,
} from "../services/gemini.js";

// Multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

// Get notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Notes.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create note
export const createNote = async (req, res) => {
  try {
    const { title, transcript } = req.body;
    const newNote = await Notes.create({
      title: title || "Untitled",
      transcript: transcript || "",
    });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update transcript
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;
    const note = await Notes.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.transcript = transcript;
    note.summary = "";
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Notes.findByIdAndDelete(id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate summary
export const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Notes.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    const summary = await summarizeWithGemini(note.transcript);

    note.summary = summary;
    await note.save();

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};

// Transcribe with Gemini
export const transcribeAudio = [
  upload.single("audio"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "Audio file is required" });

    try {
      const transcript = await transcribeWithGemini(req.file.path);
      const newNote = await Notes.create({ transcript, title: "Untitled" });

      // Delete uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file", err);
      });

      res.json({ transcript, note: newNote });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];
