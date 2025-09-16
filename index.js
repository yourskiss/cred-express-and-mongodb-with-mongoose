import express from "express";
const app = express();

import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import { teacherRoutes } from "./routes/teacherRoutes.js";

// ejs
app.set('view engine', 'ejs');

// form submissions
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  // res.send("Hello World");
  res.redirect('/teachers');
});

app.use("/teachers",teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});