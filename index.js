import express from "express";
const app = express();
import session from 'express-session';

import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import { teacherRoutes } from "./routes/teacherRoutes.js";


// genrate session
app.use(session({
  secret: process.env.SECRET_KEY,  
  resave: false,
  saveUninitialized: false
}));

// make public folder accessible for public use
app.use(express.static("public"));

// ejs
app.set('view engine', 'ejs');

// form submissions
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();


// get user session id value
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

app.get("/", (req, res) => {
  // res.send("Hello World");
  res.redirect('/teachers');
});


app.use("/teachers",teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});