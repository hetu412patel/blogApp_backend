const express = require("express")
const cors = require("cors")
require("./db/conn")
const cookieparser = require("cookie-parser")
const blogRouter = require("./routers/blogRoutes")
const userRouter = require("./routers/userRoutes")

const port = process.env.PORT 
const app = express()

app.use(cors({origin: true}))
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use("/images",express.static('images'))
app.use("/blogs",blogRouter)
app.use("/users",userRouter)
app.use(cookieparser())


// to get cookie value => req.cookies.jwt

app.listen(port, ()=>{
    console.log(`connection is setup at port ${port}`);
})