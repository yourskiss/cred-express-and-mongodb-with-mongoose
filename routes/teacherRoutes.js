import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import {
    createNewTeacher,
    createTearcherForm,
    getAllTeacher,
    getTeacherById,
    deleteTeacher,
    getTeacherUpdate, 
    updateTeacher,
    loginForm,
    loginTeacher,
    logoutTeacher
} from '../controllers/teacherControllers.js';

// public routes
router.get('/login', loginForm);
router.post('/login', loginTeacher);
router.get('/add', createTearcherForm);
router.post('/add', createNewTeacher);
router.get("/update/:id", getTeacherUpdate);
router.post("/update/:id", updateTeacher);
// router.get('/delete/:id', deleteTeacher);
router.post('/delete/:id', deleteTeacher);
router.get('/', getAllTeacher);
router.get('/detail/:id', getTeacherById);
router.get('/logout', logoutTeacher);


// protected route
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('teacherDashboard', { userSessionId: req.session.userId });
});
 
 

export const teacherRoutes = router;