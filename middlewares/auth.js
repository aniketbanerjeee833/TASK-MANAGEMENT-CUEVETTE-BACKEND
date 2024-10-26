const User=require("../models/userSchema")
const ErrorHandler = require("../utils/utilities")
const jwt=require("jsonwebtoken")

const isAuthenticated=async(req,res,next)=>
    {
        const authHeader = req.headers.authorization
    
        if (!authHeader || !authHeader.startsWith('Bearer')) {
          return res.status(401).json({
            message:'Authentication Invalid',
            success:false
        });
        }
    
        const token = authHeader.split(' ')[1]

        if (!token || token === "") {
          return res.status(401).json({
              message: 'Invalid Token',
              success: false
          });
      }
      
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
       
          if(!decoded){
              return res.status(401).json({
                  message:'Invalid',
                  success:false
              });
          }
          req.user = await User.findById(decoded.id);
          
          next()
        } catch (error) {
        console.log(error)
        return res.status(401).json({
          message: 'Invalid or Expired Token',
          success: false
      });
        }
      
    }
    
    module.exports=isAuthenticated