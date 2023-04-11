const express = require("express")
const router = new express.Router()
const { authorizeAdmin } = require("../middleware/auth")

const {register, getAllUser, changeRole, login} = require("../controller/userController")

router.post("/register", register)
router.get("/alluser", authorizeAdmin, getAllUser)
router.patch("/changerole/:id", authorizeAdmin , changeRole)
router.post('/login', login)

module.exports = router