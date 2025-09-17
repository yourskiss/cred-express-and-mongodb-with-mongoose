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
export const loginForm = async (req, res) => {
  res.render('teacherLogin', { error: null, email: '' });
}
 
export const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!email || !password) {
      return res.status(401).render('teacherLogin', {
            error: 'Email and Password are required.',
            email: email
          });
    }
    if (!emailRegex.test(email)) {
      return res.status(401).render('teacherLogin', {
            error: 'Enter valid Email ID',
            email: email
          });
    }
    if (!passwordRegex.test(password)) {
      return res.status(401).render('teacherLogin', {
        error: 'Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.',
        email: email
      });
    }

  try {
    const result = await teacherModels.findOne({ email });
    if (!result) {
      // return res.status(409).send('Invalid email id'); // Unauthorized email
      return res.status(409).render('teacherLogin', {
          error: 'Invalid email id',
          email: email
        });
    }
    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      // return res.status(409).send('Invalid password'); // Unauthorized password
      return res.status(409).render('teacherLogin', {
          error: 'Invalid password',
          email: email
        });
    }
    req.session.userId = result._id; // Save user ID in session
    console.log("session id - ",req.session.userId);
    res.redirect('/teachers/dashboard');
  } catch (err) {
      console.error('Login error:', err);
    // res.status(500).send('Internal Server Error');
    res.status(500).render('teacherLogin', {
        error: 'Internal Server Error',
        email: email
    });
  }
};


/*
export const getAllTeacher1 = async (req, res) => {
  try {
    const result = await teacherModels.find({});
    if (!result) {
      return res.status(409).render('teacherList', { error: 'No Teacher found', result: '' });
    }
    console.log("Teacher list - ",result);
    res.render("teacherList", { error:null, result:result });
  } catch (error) {
    console.error('Error fetching Teacher:', error.message);
    res.status(500).render("teacherList", { error:'Internal Server Error', result:'' });
  }
}; 
*/
export const getAllTeacher = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page number
  const limit = 2; // teachers per page
  const skip = (page - 1) * limit;
  
  const sortBy = req.query.sortBy || 'fullname'; // default field
  const order = req.query.order === 'desc' ? -1 : 1; // default A-Z
  const sortOptions = {};
  sortOptions[sortBy] = order;

  try {
    const totalTeachers = await teacherModels.countDocuments();
    const totalPages = Math.ceil(totalTeachers / limit);
    
    const result = await teacherModels.find({}).collation({ locale: 'en', strength: 1 }).sort(sortOptions).skip(skip).limit(limit);
    if (!result || result.length === 0) {
      return res.status(409).render("teacherList", {
        error: "No Teacher found",
        result: [],
        currentPage: 1,
        totalPages: 1,
        sortBy,
        order
      });
    }
    res.render("teacherList", {
      error: null,
      result,
      currentPage: page,
      totalPages,
      sortBy,
      order
    });
  } catch (error) {
    console.error("Error fetching Teacher:", error.message);
    res.status(500).render("teacherList", {
      error: "Internal Server Error",
      result: [],
      currentPage: 1,
      totalPages: 1,
      sortBy,
      order
    });
  }
};




export const getTeacherById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render('teacherDetail', { error: 'Invalid Teacher id', result: '' });
  }
  try {
    const result = await teacherModels.findById(id);
    if (!result) {
      return res.status(404).render('teacherDetail', { error: 'Teacher not found', result: '' });
    } 
    console.log("Teacher by id - ",result);
    res.render("teacherDetail", { error:null, result:result });
  } catch (error) {
    console.error('Error fetching Teacher by id:', error.message);
    res.status(500).render('teacherDetail', { error: 'Internal Server Error', result: '' });
  }
};

export const createTearcherForm = async (req, res) => {
  res.render('teacherAddForm', { error: null, fullname: '', mobile: '', email: '' });
}
export const createNewTeacher = async (req, res) => {
  const { fullname, mobile, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!fullname || !mobile || !email || !password) {
   // return res.status(401).json({ error: "All fields are required." });
    return res.status(401).render('teacherAddForm', {
          error: 'All fields are required.',
          fullname, mobile, email
        });
  }
  if (!mobileRegex.test(mobile)) {
   // return res.status(401).json({ error: "Mobile number must be exactly 10 digits." });
    return res.status(401).render('teacherAddForm', {
          error: 'Mobile number must be exactly 10 digits.',
          fullname, mobile, email
        });
  }
  if (!emailRegex.test(email)) {
   // return res.status(401).json({ error: "Email format is invalid." });
    return res.status(401).render('teacherAddForm', {
          error: 'Email format is invalid.',
          fullname, mobile, email
        });
  }
  if (!passwordRegex.test(password)) {
    return res.status(401).render('teacherAddForm', {
      error: 'Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.',
      fullname,
      mobile,
      email
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const data = { fullname, mobile, email, password: hashedPassword }
    const result = await teacherModels.create(data);
    console.log("New teacher created: ", result);
   // res.status(200).json(result);
    res.redirect('/teachers');
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
    //  return res.status(409).json({ error: `${field} already exists.` });
      return res.status(409).render('teacherAddForm', {
          error: `${field} already exists.`,
          fullname, mobile, email
        });
    }
    // res.status(500).json({ error: "Server error. Please try again later." });
    return res.status(500).render('teacherAddForm', {
          error: 'Internal Server Error. Please try again later.',
          fullname, mobile, email
        });
  }
};



export const getTeacherUpdate = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // return res.status(404).json({ message: 'Invalid Teacher id' });
    return res.render("teacherUpdateForm", { error:'Invalid Teacher id', id, result:'' });
  }
  try {
    const result = await teacherModels.findById(id);
    if (!result) {
     // return res.status(404).send("Teacher not found");
      return res.render("teacherUpdateForm", { error: 'Teacher not found', id, result:'' });
    } 
    return res.render("teacherUpdateForm", { error: null, id, result:result });
  } catch (err) {
  // return res.status(500).send("Server error");
   return res.status(500).render("teacherUpdateForm", { error: 'Internal Server Error', id, result:'' });
  }
};
export const updateTeacher = async (req, res) => {
  const { fullname, email, mobile } = req.body;
  const { id } = req.params;
  const data = { fullname, email, mobile };
  const mobileRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fullname || !email || !mobile) {
   // return res.status(400).send("All fields are required");
    return res.status(400).render("teacherUpdateForm", { error: 'All fields are required', id, result:data });
  }
  if (!mobileRegex.test(mobile)) {
    // return res.status(400).send("Invalid mobile number");
    return res.status(400).render("teacherUpdateForm", { error: 'Invalid mobile number', id, result:data });
  }
  if (!emailRegex.test(email)) {
   // return res.status(400).send("Invalid email format");
    return res.status(400).render("teacherUpdateForm", { error: 'Invalid email format', id, result:data });
  }
  try {
    const updated = await teacherModels.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    if (!updated)  {
      // res.status(404).send("Teacher not Updated");
      return res.status(404).render("teacherUpdateForm", { error: 'Teacher not Updated', id, result:data });
    }

    console.log("teacher updated: ", updated);
    res.redirect('/teachers');
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
     // return res.status(409).send();
      return res.status(500).render("teacherUpdateForm", { error:`${field} already exists`, id, result:data });
    }
    // res.status(500).send("Server error");
    return res.status(500).render("teacherUpdateForm", { error: 'Internal Server Error.', id, result:data });
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