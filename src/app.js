const express = require("express")
const cors = require("cors")
// const passport = require("passport")
// const cookieSession = require("cookie-session")

const dotenv = require("dotenv");
dotenv.config();

require("./db/conn")
const cookieparser = require("cookie-parser")
const blogRouter = require("./routers/blogRoutes")
const userRouter = require("./routers/userRoutes")
const passwordRouter = require("./routers/passwordRoutes")
// const passportSetup = require("./passport")

const port = process.env.PORT 
const app = express()

app.use(cors({origin: true}))
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use("/images",express.static('images'))
app.use("/blogs",blogRouter)
app.use("/users",userRouter)
app.use("/password",passwordRouter)
app.use(cookieparser())

// app.use(
//     cookieSession({
//         name:"session",
//         keys:["cyberwolve"],
//         maxAge: 24*60*60*100 // 24 hours
//     })
// )

// app.use(passport.initialize())
// app.use(passport.session())

app.listen(port, ()=>{
    console.log(`connection is setup at port ${port}`);
})

