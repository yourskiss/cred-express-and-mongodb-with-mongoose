import express from 'express';
const router = express.Router();

import {
    createNewTeacher,
    getAllTeacher,
    getTeacherById,

    deleteTeacher,

    getTeacherUpdate, updateTeacher
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

 

export const teacherRoutes = router;