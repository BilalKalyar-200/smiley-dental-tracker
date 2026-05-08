//main entry point for our Express backend

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

//load .env variables FIRST before anything else
dotenv.config();

//connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); //Allow frontend (localhost:5173) to talk to backend (localhost:5000)
app.use(express.json()); //parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true }));

//serve uploaded images as static files
//e.g. http://localhost:5000/uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//API Routes (we add these as we build each feature)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/symptoms", require("./routes/symptomRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/dentist", require("./routes/dentistRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));

//health check route
app.get("/", (req, res) => {
  res.json({ message: "🦷 Smiley API is running!" });
});

//global error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
