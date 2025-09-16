import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import teacherModels from '../models/teacherModels.js';



export const logoutTeacher = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid'); // Optional: clears the session cookie
    res.redirect('/teachers/login'); // Redirect to login page
  });
};
 
export const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await teacherModels.findOne({ email });
    if (!result) {
      return res.status(401).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }
    // Save user ID in session
    req.session.userId = result._id;
    console.log("session id - ",req.session.userId);
    res.redirect('/teachers/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Internal Server Error');
  }
};



export const getAllTeacher = async (req, res) => {
  try {
    const result = await teacherModels.find({});
    console.log("All Teacher list - ", result);
   // res.status(200).json(result);
    res.render("teacherList", { result });
  } catch (error) {
    console.error('Error fetching Teacher:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getTeacherById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid Teacher id' });
  
  try {
    const result = await teacherModels.findById(id);
    if (!result) return res.status(404).json({ message: 'Teacher not found' });
    console.log("Teacher by id - ",result);
   // res.status(200).json(result);
    res.render("teacherDetail", { result });
  } catch (error) {
    console.error('Error fetching Teacher by id:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const createNewTeacher = async (req, res) => {
  const { fullname, mobile, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!fullname || !mobile || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email format is invalid." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const data = { fullname, mobile, email, password: hashedPassword }
    const result = await teacherModels.create(data);
    console.log("New teacher created: ", result);
   // res.status(201).json(result);
    res.redirect('/teachers');
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ error: `${field} already exists.` });
    }
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};



export const getTeacherUpdate = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid Teacher id' });
  try {
    const result = await teacherModels.findById(id);
    if (!result) return res.status(404).send("Teacher not found");
    res.render("teacherUpdateForm", { id: req.params.id, result });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
export const updateTeacher = async (req, res) => {
  const { fullname, email, mobile } = req.body;
  if (!fullname || !email || !mobile) {
    return res.status(400).send("All fields are required");
  }
  const mobileRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).send("Invalid mobile number");
  }
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }
  try {
    const updated = await teacherModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send("Teacher not Updated");
    console.log("teacher updated: ", updated);
    res.redirect('/teachers');
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).send(`${field} already exists`);
    }
    res.status(500).send("Server error");
  }
};


export const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid Teacher id' });
  try {
    const deleted = await teacherModels.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send("Teacher not deleted");
   // res.status(200).json({ message: 'Teacher deleted successfully' });
   console.log("teacher deleted: ", deleted);
    res.redirect('/teachers');
  } catch (error) {
    console.error('Error deleting Teacher :', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};