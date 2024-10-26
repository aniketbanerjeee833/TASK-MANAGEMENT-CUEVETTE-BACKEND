const User = require("../models/userSchema")
const ErrorHandler=require("../utils/utilities")
const Task=require("../models/taskSchema")
const jwt=require("jsonwebtoken")


const register = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body
        if (!userName || !email || !password )
            return res.status(400).json({
                success: false,
                message: "All fields required",
                user
            })
             
        const userExists = await User.findOne({ email })
        if (userExists) 
            return res.status(400).json({
                success: false,
                message: "User already exists please login",
                user
            })
           
        const user = await User.create({
            userName, email, password, 
        })
        console.log(user)
        return res.status(200).json({
            success: true,
            message: "User Registered",
            user
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) 
            return res.status(400).json({
                success: false,
                message:"All fields required"
              })
           
        const user = await User.findOne({ email })
        
        if (!user)
            return res.status(404).json({
                success: false,
                message:"Invalid Email"
              })
         

        const isPasswordMatched = await user.comparePassword(password)
        if (!isPasswordMatched) 
            return res.status(401).json({
                success: false,
                message:"Invalid Password"
              }) 
           

            const token = user.createJwt()
      
        return res.status(200).json({
            success: true,
            message1:"login successfull",
            message2:`Welcome ${user.userName}`,
            user,token
          }) 


    }
    catch (error) {
        console.log(error)
        next(error)

    }

}
const logout = async (req, res, next) => {
    try {
        return res.status(200).json({
           
            success: true,
            message: "Logged Out!",
            // token:"",   

        });
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return next(new ErrorHandler("user not logged in",400))
        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const assignedTaskView=async(req,res,next)=>
{
    try{
        const userId=req.user._id

        const user = await User.findById(req.user._id)
      
        const email=user.email
      
        // const task1=await Task.find()
        // const task=await Task.find({ userId: userId })
     
    //  const getAssignedTasks=task1.filter((assignTask)=>assignTask.assigned.includes(email))

    const allTasks = await Task.find({
        $or: [
            { userId: userId }, // Tasks created by the user
            { assigned: email }  
        ]// Tasks assigned to the user
        })
    // const getAssignedTasks=task.find({assigned:{ $elemMatch: { ass:  } } })
    // const getAssignedTasks=task.find({"task.assigned":email})

    // let allTasks=[...task,...getAssignedTasks]
    console.log(allTasks)
        return res.status(200).json({
            success: true,
           allTasks
        })

    }catch(error){
        next(error)
        console.log(error)
    }
}

const updateUser=async (req,res,next)=>
{
    try{
        const{oldPassword,newPassword,email,userName}=req.body
        const user = await User.findById(req.user._id)


        function isValidPassword(newPassword) { 
            // Password should be max 10 characters, should not contain "www" or "http"
            const passwordRegex = /^(?!.*(www|http)).{1,10}$/;
            return passwordRegex.test(newPassword);
        }
        
        
          
        if (!oldPassword || !email || !userName ) {
          return    res.status(400).json({
            success:false,
            message: "Please fill all details ,,name,email,old password is mandatory and cannot be empty",
           
          });
        }

             
        if (email !== user.email) {
            // Check if the new email already exists in the database
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use by another user. Email must be unique.",
                });
            }
        }

        const isPasswordMatched = await user.comparePassword(oldPassword);
        if (!isPasswordMatched) {
          return   res.status(400).json({
            success:false,
            message: "Old Password wrong",
           
          });
        }

        if (newPassword) {
            if (!isValidPassword(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: "New Password should be max length of 10  and not contain 'www' or 'http'",
                });
            }
            user.password = newPassword; // Update the password if it passes validation
        }
            
        
       
        user.email=email;
        user.userName=userName
        await user.save();
       const taskNameUpdate= await Task.find({userId:req.user._id})
       
      

        // taskNameUpdate[0].userName=userName
        // await taskNameUpdate.save()
       
        
    if (taskNameUpdate.length > 0) {
        // Loop through each task and update the userName
        for (let i = 0; i < taskNameUpdate.length; i++) {
            taskNameUpdate[i].userName = userName;
            await taskNameUpdate[i].save(); // Save each task individually
        }
    }
      
       
        res.status(200).json({
          success: true,
          message: "User Details Updated!",
          user
        });
      
    }catch(error){
        console.log(error)
        next(error)
    }
}
const getAllUsersExceptMe=async(req,res,next)=>
{
    try{
        const userId=req.user._id;
        const allUsersExceptMe=await User.find({
            _id: { $ne: userId }
          }).select("email userName")

          return res.status(200).json({
            success: true,
      allUsersExceptMe
        })
    }catch(error){
        console.log(error)
        next(error)
    }
}
module.exports={register,login,logout,getUser,assignedTaskView,updateUser,getAllUsersExceptMe}
