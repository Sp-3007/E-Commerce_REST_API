const express = require("express");
const router = express.Router();


const userController =require("../controllers/user")

router.post("/signup",userController.user_post);

router.get("/login", userController.user_get );

router.delete("/:userID", userController.user_delete);

module.exports = router;
