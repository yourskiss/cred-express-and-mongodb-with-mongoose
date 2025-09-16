import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import {
    createNewTeacher,
    getAllTeacher,
    getTeacherById,

    deleteTeacher,

    getTeacherUpdate, updateTeacher,
    loginTeacher, logoutTeacher
} from '../controllers/teacherControllers.js';

router.get('/add', (req, res) => {
  res.render('teacherAddForm');  
});
router.post('/add-submmit', createNewTeacher);
router.get('/', getAllTeacher);
router.get('/detail/:id', getTeacherById);

router.post('/delete/:id', deleteTeacher);

router.get("/update/:id", getTeacherUpdate);
router.post("/update-submit/:id", updateTeacher);


router.get('/login', (req, res) => {
  res.render('teacherLogin');
});
router.post('/signin', loginTeacher);

router.get('/logout', logoutTeacher);

router.get('/dashboard', isAuthenticated, (req, res) => {
 // res.send(`Dashboard, user ID: ${req.session.userId}`);
  res.render('teacherDashboard', { userSessionId: req.session.userId });
});
 
 

export const teacherRoutes = router;