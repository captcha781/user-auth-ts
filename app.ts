import dotenv from "dotenv"
dotenv.config()
import express = require('express')
import bodyParser = require('body-parser')
import userRoutes from "./routes/userRouter"
import mongoose = require("mongoose")
import cors from "cors"

const app: express.Application = express()

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST','PUT','DELETE']
}))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"))

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Server is running successfully")
})
app.use("/api/user/", userRoutes)


if(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, (err) => {
    if(err){
        console.log(err);
        return
    }
    app.listen(5000, () => {
        console.log("Server listens in the port 5000...");
    })
})
