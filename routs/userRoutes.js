const express = require('express');
const { getAllUsers, getUsersById, addUser, updateUser, deleteUser, getUsersByDepartmentId, checkLogin, uploadFile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

//router
const router = express.Router();

//all user

router.get('/allusers', verifyToken, getAllUsers)

//get user by id

router.get('/get/:id', verifyToken, getUsersById)

//add user

router.post('/addUser', verifyToken, addUser)

//update user by id

router.put('/updateUser/:id', verifyToken, updateUser)

//delete user

router.delete('/deleteUser/:id', verifyToken, deleteUser)

//get user by dept id

router.get('/getUserByDepartmentId/:id', verifyToken, getUsersByDepartmentId)

//check login email

router.post('/login', checkLogin)

//file upload

router.post('/upload', verifyToken, uploadFile);

module.exports = router