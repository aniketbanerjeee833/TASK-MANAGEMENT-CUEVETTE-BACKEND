const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true
    },
  
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
  
 
   
   

}, { timestamps: true })


userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)

})

userSchema.methods.comparePassword=async function(userPassword){
return await bcrypt.compare(userPassword,this.password)
    
}
userSchema.methods.createJwt=function(){
    return  jwt.sign({id:this. _id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
    })
}


module.exports = mongoose.model("User", userSchema)