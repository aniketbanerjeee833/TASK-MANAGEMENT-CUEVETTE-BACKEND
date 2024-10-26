require("dotenv").config()
const express = require("express");


const app = express();

const connectDB = require("./db/connect")
 const { errorMiddleware } = require("./middlewares/error");


const cors=require("cors")
//const userRouter=require("./routes/userRoutes")
const userRouter=require("./routes/userRoutes")
 const taskRouter=require("./routes/taskRoutes")
// const cookieParser = require("cookie-parser")



app.use(express.json())

app.use(cors({
  origin: ["http://localhost:5173",  process.env.CLIENT_URL,],


  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

 app.use(errorMiddleware);
app.use("/api/v1/user",userRouter)
app.use("/api/v1/task",taskRouter)



const port = 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
   app.listen(port, console.log(`Server listening  on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()