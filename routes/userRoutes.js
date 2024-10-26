const express =require("express");
const { register, login,  logout, getUser, assignedTaskView, updateUser, getAllUsersExceptMe} = require("../controllers/userController");
const isAuthenticated = require("../middlewares/auth");

//const{isAuthenticated}=require("../middlewares/auth")

const router=express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated ,logout)
router.get("/me", isAuthenticated, getUser);
router.get("/exceptMe", isAuthenticated, getAllUsersExceptMe);
router.get("/assignedTask", isAuthenticated, assignedTaskView);
router.put("/updateUser", isAuthenticated, updateUser);
module. exports = router