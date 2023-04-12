const express = require("express")
const router = new express.Router()
const {resetpassword, verifyUser, changePassword} = require('../controller/passwordController')

router.post("/sendpasswordlink", resetpassword)
router.get("/forgetpassword/:id/:token", verifyUser)
router.patch("/:id/:token", changePassword)

module.exports = router