import express = require("express")
import * as userController from "../controllers/userController"
import userMiddleware from "../middlewares/userAuthChecker"
import { RouterModified } from "../types"
import multer = require("multer");
import os from "os"


var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, os.tmpdir());
    }, 
    filename: function (req, file, cb) { 
        
       cb(null , Date.now()+file.originalname);   
    }
 });

const upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 1024*1024*2,
            
        }
    })

const router: RouterModified = express.Router()

router.get("/", userMiddleware, userController.index)

router.post("/register", userMiddleware, upload.single("profile"), userController.registration)

router.post("/login", userMiddleware, userController.login)

router.post("/create-post",userMiddleware, userController.createPost )

router.get("/posts", userController.getPosts)

router.delete("/posts/:id", userMiddleware, userController.deletePosts)

router.put("/edit-post", userMiddleware, userController.editPosts)

// router.post("/upload-profile", userMiddleware, userController.uploadProfile)

export default router