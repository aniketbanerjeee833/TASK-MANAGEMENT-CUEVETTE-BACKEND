const express =require("express");
const { createTask,  updateChecklistStatus, deleteTask, 
    updateTaskStatus, analyticsTask, sharedTaskView, getAllUsersToAssign, assignTaskOnAddPeople, checkDueDate, getAllMyTasksToday, getAllMyTasksForThisMonth, getAllMyTasksThisWeek, 
     getSingleTaskForEdit, editTask,
     getSingleTask} = require("../controllers/taskController");
const isAuthenticated = require("../middlewares/auth");


//const { isAuthenticated } = require("../middlewares/auth");


const router=express.Router()
// router.get("/singleStory/:id", getSingleStory)
router.post("/create",isAuthenticated,createTask)
router.get("/allUsersToAssign",isAuthenticated,getAllUsersToAssign)

 router.get("/allMyTasks",isAuthenticated,getAllMyTasksThisWeek)

 router.patch("/updateCheckListStatus/:taskId",isAuthenticated,updateChecklistStatus)
 router.delete("/deletetask/:taskId",isAuthenticated,deleteTask)
router.patch("/updateTask/:taskId",isAuthenticated,updateTaskStatus)
router.get("/analyticsTask",isAuthenticated,analyticsTask)

router.get("/sharedTask/:taskId",sharedTaskView)

router.put("/addAlltasks",isAuthenticated,assignTaskOnAddPeople)
router.patch("/updateDueDate",isAuthenticated,checkDueDate)
router.get("/allMyTasksToday/:date",isAuthenticated,getAllMyTasksToday)
router.get("/allMyTasksThisMonth/:month/:year",isAuthenticated,getAllMyTasksForThisMonth)


router.get("/singleTaskForEdit/:taskId",isAuthenticated,getSingleTaskForEdit)

router.get("/singleTask/:taskId",getSingleTask)
router.patch("/editTask/:taskId",isAuthenticated,editTask)
// router.put("/likeOrDislike/:id", isAuthenticated,likeOrDislikeStory)
// router.get("/storiesByCategory/:category",getStoriesByCategory)
// router.put("/update/:id",isAuthenticated, editStory);



module. exports = router