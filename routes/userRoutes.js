const express = require('express');
const { getAllAuthorUsers, getAllBooksUsers,getAllGenreUsers , getUsersById, updateUserAuthor,updateUserBook,updateUserGener, deleteUser, getUsersByDepartmentId, addUserAuthor, addUserBook, addUserGener } = require('../controllers/userController');
// const { verifyToken } = require('../middleware/auth');

//router
const router = express.Router();

//all user

router.get('/getAllAuthorUsers', getAllAuthorUsers)
router.get('/getAllBooksUsers', getAllBooksUsers)
router.get('/getAllGenreUsers', getAllGenreUsers)

//get user by id

router.get('/get/:id', getUsersById)

//add user

router.post('/addUserAuthor', addUserAuthor)
router.post('/addUserBook', addUserBook)
router.post('/addUserGener', addUserGener)

//update user by id

router.put('/updateUserAuthor/:id', updateUserAuthor)
router.put('/updateUserBook/:id', updateUserBook)
router.put('/updateUserGener/:id', updateUserGener)

//delete user

router.delete('/deleteUser/:id', deleteUser)

//get user by dept id

router.get('/getUserByDepartmentId/:id', getUsersByDepartmentId)

//check login email

// router.post('/login', checkLogin)

//file upload

// router.post('/upload', verifyToken, uploadFile);

module.exports = router