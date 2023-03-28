const express = require("express")
require("./db/conn")
const cookieparser = require("cookie-parser")
const blogRouter = require("./routers/blogRoutes")
const userRouter = require("./routers/userRoutes")

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(blogRouter)
app.use(userRouter)
app.use(cookieparser())

// to get cookie value => req.cookies.jwt

app.listen(port, ()=>{
    console.log(`connection is setup at port ${port}`);
})