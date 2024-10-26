
const mongoose=require("mongoose")
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
   
    priority:{
        type:String,
        enum:["medium-priority","low-priority","high-priority"],
        required:true
    },
    checkList:[{
        content: {
            type: String
        },
        status:{
            type: Boolean,
            default: false
        },
        id: {
            type: String,
    
        },

    }],

    dueDate:{
        type: String,
        
       
    },

    dueDatePassed:{
        type: String,
    },


    assigned:{
        type:Array,
        default:[] 
    },
    userName:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

    taskStatus:{
        type:String,
        enum:["to-do","backlog","in-progress","done"],
        default:"to-do"
    }
 
})

module.exports = mongoose.model("Task", taskSchema)