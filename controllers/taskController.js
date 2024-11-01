const ErrorHandler = require("../utils/utilities")
const Task = require("../models/taskSchema")
const User=require("../models/userSchema")

const createTask = async (req, res, next) => {
    try {
        //const creator=req.user._id
        const userId = req.user._id
        const user=await User.findById(userId)
        const userName=user.userName;

        const { title, priority, selectedDate, checkList, assigned } = req.body

        if (!title || !priority || checkList.length==0) {
            return res.status(400).json({

                success: false,
                message: "plz fill all details to create a task,, star marked fields  are compulsory",


            })
        }

        // const user=await User.find()
        // let validUser;
        // for(let i=0;i<assigned.length;i++){
        //      validUser=user.filter((user)=>user.email==assigned[i])
          
        // }
      
        // console.log(validUser)
        // if(!validUser){
        //     return res.status(400).json({

        //         success: false,
        //         message: "wrong email address user does not exists",


        //     })
        // }
     
        
        if (selectedDate !== " ") {
            const [day, month, year] = selectedDate.split("-");
            const formattedDate = `${year}-${month}-${day}`;
            const selected = new Date(formattedDate).setHours(0, 0, 0, 0);
            // Convert both dates to "YYYY-MM-DD" format for a date-only comparison
            const today = new Date().setHours(0, 0, 0, 0); // Set time to midnight for today
           
        
            if (selected < today) {
                return res.status(400).json({
                    success: false,
                    message: "due-date must be ahead of the current date",
                });
            }
        }
       

        const task = new Task({
            title, assigned, dueDate:selectedDate, priority, checkList,userName,

            userId

        })

        await task.save()

        return res.status(200).json({
            success: true,
            message: "Task created successfully",
            task
        })


    } catch (error) {

        console.log(error)
        next(error)
    }
}

const getAllUsersToAssign=async(req,res,next)=>
{
    try{
        const user=await User.find()
        const allUsersName=user.map((curUser)=>curUser.userName)
        const allUsersEmail=user.map((curUser)=>curUser.email)

        return res.status(200).json({
            success: true,
        allUsersEmail,allUsersName
        })

    }catch(error){
        console.log(error)
        next(error)
    }
}

const getAllMyTasksThisWeek = async (req, res, next) => {
    try {
        const userId=req.user._id
        const user = await User.findById(req.user._id)

        // const task1=await Task.find()
        // const task=await Task.find({ userId: userId })
        const email=user.email
      
       
   
    //  const getAssignedTasks=task1.filter((assignTask)=>assignTask.assigned.includes(email))
    //     let allTasks=[...task,...getAssignedTasks]

    const allTasks = await Task.find({
        $or: [
            { userId: userId }, // Tasks created by the user
            { assigned: email }  
        ]// Tasks assigned to the user
        })

      let thisWeekTasks=[]
        console.log(allTasks)

        for(let i=0;i<allTasks.length;i++){
            // const dueDateStr = allTasks[i]?.dueDate;
            const date=allTasks[i].dueDate
          
            if (!date || date.trim() === '') {
                
                console.log(`Task ${allTasks[i]._id} has no due date.`);
                thisWeekTasks.push(allTasks[i])// If there's no due date,   push it to thisWeekTasks
                continue; 
            }
      


        const [day, month, year] = date.split('-').map(Number);

// Create a Date object for the due date
const dueDate = new Date(year, month - 1, day); // Month is 0-indexed

// Get the current date
const currentDate = new Date();

// Get the start of the current week (Monday)
const startOfWeek = new Date(currentDate);
startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday is the start of the week
startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day

// Get the end of the current week (Sunday)
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to Monday
endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day

// Check if the dueDate is within the current week
const isDueDateInCurrentWeek = dueDate >= startOfWeek && dueDate <= endOfWeek;
console.log(isDueDateInCurrentWeek)
        
if(isDueDateInCurrentWeek){
    thisWeekTasks.push(allTasks[i])
    
    console.log(thisWeekTasks)
} 
// }else{
//     thisWeekTasks.push(allTasks[i])
// }
}  

return res.status(200).json({
    success: true,
    tasks:thisWeekTasks
})  
   
       
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllMyTasksToday = async (req, res, next) => {
    try {
        const userId=req.user._id
        const date=req.params.date
        console.log(date)
        const user = await User.findById(req.user._id)
      
        const email=user.email
        // const task1=await Task.find()
        // const task=await Task.find({ userId: userId })
      
   
    //  const getAssignedTasks=task1.filter((assignTask)=>assignTask.assigned.includes(email))
    //     let allTasks=[...task,...getAssignedTasks]
    const allTasks = await Task.find({
        $or: [
            { userId: userId }, // Tasks created by the user
            { assigned: email }  
        ]// Tasks assigned to the user
        })

        // const tasks = await Task.find({ dueDate: date })
        const tasks1=allTasks.filter((cur)=>cur.dueDate==date)
        const restTasks=allTasks.filter((cur)=>!cur.dueDate)
        let tasks=[...tasks1,...restTasks]
        // todaysTask.push(task)

        console.log(tasks)
      
        return res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllMyTasksForThisMonth = async (req, res, next) => {
    try {
        const userId=req.user._id
        
        const user = await User.findById(req.user._id)
      
        const email=user.email
      
       
        // const task1=await Task.find()
        // const task=await Task.find({ userId: userId })
    //  const getAssignedTasks=task1.filter((assignTask)=>assignTask.assigned.includes(email))
    //     let allTasks=[...task,...getAssignedTasks]
        const allTasks = await Task.find({
            $or: [
                { userId: userId }, // Tasks created by the user
                { assigned: email }  
            ]// Tasks assigned to the user
            })

     
        const month=req.params.month;
        const year=req.params.year;
        // console.log(month,year)
        // const pattern= `^\\d{2}-${month < 10 ? '0' + month : month}/${year}$`
        const pattern = new RegExp(`^\\d{2}-${month < 10 ? '0' + month : month}-${year}$`)
      
            const tasks1=allTasks.filter((cur)=>cur.dueDate && cur.dueDate.match(pattern))
            const restTasks=allTasks.filter((cur)=>!cur.dueDate)
            let tasks=[...tasks1,...restTasks]
            console.log(tasks)
            return res.status(200).json({
                success: true,
                tasks
            })
       
      
        // const tasks = await Task.find( {dueDate: {$regex: `^\\d{2}-${month < 10 ? '0' + month : month}-${year}$`}})
       
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const updateChecklistStatus = async (req, res, next) => {
    try {

        const taskId=req.params.taskId
        //const checkListId=req.params.checkListId
        const { updatedCheckList } = req.body;
        const task=await Task.findById(taskId)
      
        if(!task){
            return res.status(400).json({

                success: false,
                message: "Task not exists",
                
            })
        }
        
        // const checkListStatus=task.checkList.filter((curCheckList)=>curCheckList._id==checkListId)
      
        // checkListStatus[0].status=status
       
        // await task.save()
        const taskToUpdate=await Task.findByIdAndUpdate(taskId,{checkList:updatedCheckList},
            {new:true,   runValidators: true,
            useFindAndModify: false,})

        //console.log(checkListStatus,task)
        return res.status(200).json({

            success: true,
            message: "CheckList Status updated successfully",
            taskToUpdate
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteTask=async(req,res,next)=>{
    try{

        const taskId=req.params.taskId;
        const task=await Task.findById(taskId)
        if(!task){
            return res.status(400).json({

                success: false,
                message: "Task not exists",
                
            })
        }
        await task.deleteOne()
        return res.status(200).json({

            success: true,
            message: "Task deleted successfully",
            
        })
    
    }catch(error){
        console.log(error)
        next(error)
    }
}

const updateTaskStatus = async (req, res, next) => {
    try {

        const taskId=req.params.taskId
        
        const { status } = req.body;
        const task=await Task.findById(taskId)
      
        if(!task){
            return res.status(400).json({

                success: false,
                message: "Task not exists",
                
            })
        }
        
       

        const updatedTask=await Task.findByIdAndUpdate(taskId,{taskStatus:status},{new:true,runValidators:true})
       
       

        console.log(updatedTask)
        return res.status(200).json({

            success: true,
            message: "Task updated successfully",
            updatedTask
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const analyticsTask=async(req,res,next)=>
{
    try{

        const userId=req.user._id
        
        const user = await User.findById(req.user._id)
      
        const email=user.email;

        // const task1=await Task.find()
        // const task=await Task.find({ userId: userId })
   
    //  const getAssignedTasks=task1.filter((assignTask)=>assignTask.assigned.includes(email))
    //     let allTasks=[...task,...getAssignedTasks]

    const allTasks = await Task.find({
        $or: [
            { userId: userId }, // Tasks created by the user
            { assigned: email }  
        ]// Tasks assigned to the user
        })
        let sumToDoTask=0;
        let sumBacklogTask=0;
        let sumDoneTask=0;
        let sumInProgressTask=0;

        let sumLowPriorityTask=0;
        let sumMediumPriorityTask=0;
        let sumHighPriorityTask=0;
        let sumDueDateTask=0

        // const task=await Task.find()
        const toDoTask=allTasks.filter((curTask)=>curTask.taskStatus=="to-do")
        sumToDoTask+=toDoTask.length
        const backlogTask=allTasks.filter((curTask)=>curTask.taskStatus=="backlog")
        sumBacklogTask+=backlogTask.length
        const doneTask=allTasks.filter((curTask)=>curTask.taskStatus=="done")
        sumDoneTask+=doneTask.length
        const inProgressTask=allTasks.filter((curTask)=>curTask.taskStatus=="in-progress")
        sumInProgressTask+=inProgressTask.length

        const highPriorityTask=allTasks.filter((curTask)=>curTask.priority=="high-priority")
         sumHighPriorityTask+=highPriorityTask.length

         const lowPriorityTask=allTasks.filter((curTask)=>curTask.priority=="low-priority")
         sumLowPriorityTask+=lowPriorityTask.length

         const mediumPriorityTask=allTasks.filter((curTask)=>curTask.priority=="medium-priority")
         sumMediumPriorityTask+=mediumPriorityTask.length

        //  const now=Date.now()
        const today = new Date()
         sumDueDateTask+=allTasks.filter((curTask)=>curTask.dueDatePassed=="yes").length
         

        //  for(let i=0;i<dueDateTasks.length;i++){
        //     const [day, month, year] = dueDateTasks[i].dueDate.split('-').map(Number)
        //     const givenDate = new Date(year, month - 1, day)
        //     if(givenDate>today){
        //         sumDueDateTask+=1
        //     }else{
        //         sumDueDateTask=sumDueDateTask
        //     }
        //     console.log(givenDate)
        //  }
        
         console.log(sumDueDateTask)
        return res.status(200).json({

            success: true,
           
           sumToDoTask,sumBacklogTask,sumDoneTask,sumInProgressTask,sumHighPriorityTask,sumMediumPriorityTask,sumLowPriorityTask,sumDueDateTask,
        })

    }catch(error){
        next(error)
        console.log(error)
    }
}
const sharedTaskView=async(req,res,next)=>
{
    try{

        const taskId=req.params.taskId
        const sharedTask=await Task.findById(taskId)
        return res.status(200).json({

            success: true,
           
            sharedTask
        })

    }catch(error){
        next(error)
        console.log(error)
    }
}

const assignTaskOnAddPeople=async(req,res,next)=>
{
    try{
        const userId = req.user._id
        const tasks = await Task.find({ userId: userId })
        const{email}=req.body
        const user = await User.findOne({ email })
        
        if (!user)  return res.status(200).json({
            success:false,
            message:"invalid email,user not exits"

        })
        const assignedTask=await Task.updateMany({},  { $addToSet: { assigned: email } })
        // await assignedTask.save()
        console.log(assignedTask)
        return res.status(200).json({
            success:true,
            message:`${email} added to Board`,
            assignedTask

        })
    }catch(error){
        console.log(error)
        next(error)
    }
}

const editTask=async(req,res,next)=>
{
    try{
        
        const taskId=req.params.taskId
        
        const { title, priority, dueDate, checkList, assigned } = req.body

        if (!title || !priority  || !checkList) {
            return res.status(200).json({

                success: false,
                message: "plz fill all details",


            })
        }
        if (dueDate !== " ") {
            const [day, month, year] = dueDate.split("-");
            const formattedDate = `${year}-${month}-${day}`;
            const selected = new Date(formattedDate).setHours(0, 0, 0, 0);
            // Convert both dates to "YYYY-MM-DD" format for a date-only comparison
            const today = new Date().setHours(0, 0, 0, 0); // Set time to midnight for today
           
        
            if (selected < today) {
                return res.status(400).json({
                    success: false,
                    message: "due-date must be ahead of the current date",
                });
            }
        }
        //const task=await Task.find(taskId)

        const taskToUpdate=await Task.findByIdAndUpdate(taskId,{title:title,priority:priority,dueDate:dueDate,
            checkList:checkList,assigned:assigned,
        },
            {new:true,   runValidators: true,
            useFindAndModify: false,})

            return res.status(200).json({
                success:true,
                message:"updated successfully",
                taskToUpdate,
            })
    }catch(error){
        console.log(error)
        next(error)
    }
}

const checkDueDate=async(req,res,next)=>
{
    try{
        const task=await Task.find()
        const today = new Date()
        const dueDateTasks=task.filter((curTask)=>curTask.dueDate)
        let taskToUpdate1;
        let taskToUpdate2;
        let taskToUpdate3;
        let taskToUpdate=[];
        today.setHours(0, 0, 0, 0);
        console.log(today)
        for(let i=0;i<dueDateTasks.length;i++){
           const [day, month, year] = dueDateTasks[i].dueDate.split('-').map(Number)
           const givenDate = new Date(year, month - 1, day)
    
           givenDate.setHours(0, 0, 0, 0)
         
           if(givenDate > today){
             taskToUpdate1=await Task.findByIdAndUpdate(dueDateTasks[i]._id,
                {dueDatePassed:"no"},
                {new:true,   runValidators: true,
                useFindAndModify: false})

                taskToUpdate.push(taskToUpdate1)

           }
           else if (givenDate < today){
             taskToUpdate2=await Task.findByIdAndUpdate(dueDateTasks[i]._id,
                {dueDatePassed:"yes"},
                {new:true,   runValidators: true,
                useFindAndModify: false})

                taskToUpdate.push(taskToUpdate2)

                

           }
           else {
            taskToUpdate3=await Task.findByIdAndUpdate(dueDateTasks[i]._id,
                {dueDatePassed:"no"},
                {new:true,   runValidators: true,
                useFindAndModify: false})
                taskToUpdate.push(taskToUpdate3)
           }
           console.log(taskToUpdate3)
        } 
        
    //    let taskToUpdate=await Promise.all(taskToUpdate1,taskToUpdate2)
          
           return res.status(200).json({
            success:true,
           
            taskToUpdate
        })
          
       
    }catch(error){

    }
}



const getSingleTaskForEdit=async(req,res,next)=>
{
    try{

        const taskId=req.params.taskId

        const singleTaskForEdit=await Task.findById(taskId)

        return res.status(200).json({

            success: true,
           
            singleTaskForEdit
        })

    }catch(error){
        next(error)
        console.log(error)
    }
}

const getSingleTask=async(req,res,next)=>
    {
        try{
    
            const taskId=req.params.taskId
    
            const singleTask=await Task.findById(taskId)
    
            return res.status(200).json({
    
                success: true,
               
                singleTask
            })
    
        }catch(error){
            next(error)
            console.log(error)
        }
    }
    


module.exports = { createTask, getAllMyTasksThisWeek, updateChecklistStatus,deleteTask,updateTaskStatus,analyticsTask ,editTask,
    assignTaskOnAddPeople,checkDueDate,getAllMyTasksToday,getAllMyTasksForThisMonth,getSingleTaskForEdit,getSingleTask,
    sharedTaskView,getAllUsersToAssign}