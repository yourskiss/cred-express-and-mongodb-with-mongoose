import mongoose from "mongoose";
import teacherModels from '../models/teacherModels.js';
 

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
  const { fullname, mobile, email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!fullname || !mobile || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email format is invalid." });
  }
  try {
    const result = await teacherModels.create(req.body);
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
    await teacherModels.findByIdAndDelete(id);
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting Teacher :', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};