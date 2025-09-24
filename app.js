import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import notesRoutes from "./routes/Notes.js";
import path from "path";

connectDB();

const app = express();

app.use(cors({
  origin: '*'  
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads"))); 

app.use("/api/notes", notesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
