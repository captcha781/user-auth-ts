import dotenv from "dotenv";
dotenv.config();
import express = require("express");
import joi = require("joi");
import mongoose from "mongoose";
import UserModel from "../models/UserModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "process";
import { MailObject, RequestModified } from "../types";
import mv from "mv"
import nodemailer, { TransportOptions } from "nodemailer"
import moment from "moment"
import PostModel from "../models/PostModel";

const sendMail = async (mailObject: MailObject) => {
    const { from, to, subject } = mailObject

    const tranpsort = nodemailer.createTransport({
        service: "sendinblue",
        auth: {
            user: env.NODEMAILER_USER,
            pass: env.NODEMAILER_PASS,

        }
    })

    let mailStatus = tranpsort.sendMail(mailObject)
        .then(mailResponse => {
            console.log(mailResponse);
        })
        .catch(err => {
            console.log(err);
        })

}


const JOIschema = joi
    .object({
        username: joi.string().alphanum().required().lowercase(),
        name: joi.string().alphanum().required(),
        email: joi
            .string()
            .email({ tlds: { allow: ["com", "in"] } })
            .required(),
        password: joi
            .string()
            .pattern(
                new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$")
            )
            .required(),
        confpassword: joi
            .string()
            .pattern(
                new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$")
            )
            .required()
    })


export const registration = (req: express.Request, res: express.Response) => {
    // console.log(req.file)
    if (!req.file) {
        return res.json({ auth: false, message: "No Image Found" })
    }
    const { name, email, password, username, confpassword } = req.body;
    JOIschema.validateAsync({ username, name, email, password, confpassword })
        .then((result) => {
            return UserModel.find({ email, username });
        })
        .then((findResponse): any => {
            if (password !== confpassword) {
                return res.json({ auth: false, message: "Password and Confirm password didn't match" });
            }
            if (findResponse.length > 0) {
                return res.json({ auth: false, message: "User already exists" });
            }

            bcryptjs.hash(password, 15)
                .then((hashresult) => {
                    let id = new mongoose.Types.ObjectId()
                    return UserModel.create({ _id: id, username, name, email, password: hashresult, profilePic: "http://localhost:5000/profiles/" + String(id) + "." + req.file?.originalname.split(".")[1] })
                        .then((createResponse) => {
                            let token;
                            if (env.JWT_SECRET) {
                                token = jwt.sign({ id: createResponse._id }, env.JWT_SECRET, {
                                    expiresIn: 3600,
                                });
                            }
                            if (createResponse.password) {
                                createResponse.password = "";
                            }
                            if (req.file?.path) {
                                mv(req.file?.path, __dirname + "/../public/profiles/" + String(createResponse._id) + "." + req.file.originalname.split(".")[1], (err) => {
                                    // console.log(err);
                                })
                            }
                            return res.json({
                                auth: true,
                                message: "Resgistration Successful",
                                user: createResponse,
                                token,
                            });
                        })
                })
                .catch((err) => res.json({ auth: false, message: err.message }));
        })

        .catch((err) => res.json({ auth: false, message: err.message }));
};

const JOILoginSchema = joi.object({
    email: joi
        .string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
    password: joi
        .string()
        .pattern(
            new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$")
        )
        .required(),
});

export const login = (req: RequestModified, res: express.Response) => {
    const { email, password } = req.body;

    JOILoginSchema.validateAsync({ email, password })
        .then((result) => {
            return UserModel.findOne({ email });
        })
        .then((findResponse): any | Promise<Boolean> => {
            if (!findResponse) {
                res.status(402).json({ auth: false, message: "No user found with this email" })
                return
            }
            req.user = findResponse
            bcryptjs.compare(password, req.user.password)
                .then(matchRes => {
                    if (!matchRes) {
                        res.status(402).json({ auth: false, message: "Passwords doesn't match" })
                    }
                    let token;
                    if (env.JWT_SECRET && env.NODEMAILER_USER) {
                        token = jwt.sign({ id: req.user._id }, env.JWT_SECRET, { expiresIn: 3600 })
                        req.user.password = ""
                        // sendMail({from:env.NODEMAILER_USER,to:req.user.email,subject:"Login Alert",text: "Hello, You're logged into your account"})
                        res.status(201).json({ auth: true, user: req.user, token, message: "Login Successful" })
                    }
                })
                .catch((err) => res.json(500).json({ message: err.message }))
        })
        .catch((err) => res.status(500).json({ message: err.message }))

};

export const index = (req: RequestModified, res: express.Response) => {
    if (!req.user) {
        return res.status(403).json({
            user: null,
            message: "You're not logged in , so get out...",
        });
    }
    return res.status(200).json({
        auth: true,
        user: req.user,
        message: "You're logged in don't worry!!!",
    });
};

const postValidation = joi.object({
    title: joi.string().min(5).max(75).required(),
    content: joi.string().min(10).max(1000).required()
})

export const createPost = (req: RequestModified, res: express.Response) => {

    const { title, content } = req.body
    const { user } = req.user
    const time = moment().format('MMM Do YYYY, h:mm a');

    postValidation.validateAsync({ title, content })
        .then(() => {
            PostModel.create({ title, content, postTime: time, postedBy: req.user })
                .then(postCreateResponse => {
                    res.status(200).json({ message: "Posted Successfully", post: postCreateResponse })
                })
                .catch(err => {
                    res.status(406).json({ message: "Unable to post" })
                    console.log(err);

                })
        })
        .catch(err => {
            res.status(406).json({ message: err.message })
        })


}

export const getPosts = (req: RequestModified, res: express.Response) => {
    PostModel.aggregate([{ $match: {} }, { $sort: { _id: -1 } }, { $limit: 20 }])
        .then(foundRes => {
            res.status(200).json({ posts: foundRes })
        })
        .catch(err => {
            res.json(500).json({ message: "Some error occured in fetching posts please try again..." })
        })
}

export const deletePosts = (req: RequestModified, res: express.Response) => {
    const id = req.params.id

    const post = PostModel.findById(id)
        .then(postfoundResponse => {

            if (!postfoundResponse) {
                res.status(404).json({ message: "Post not found" })
            }


            if (postfoundResponse?.postedBy.username !== req.user.username) {
                return res.status(401).json({ message: "Unauthorized activity." })
            }

            PostModel.findByIdAndDelete(id)
                .then(deleteResponse => {
                    res.status(200).json({ message: "Post deleted Successfully." })
                })
                .catch(err => {
                    res.json({ message: "Post not found..." })
                })
        })
        .catch(err => {
            res.json({ message: err.message })
        })

}


export const editPosts = (req: RequestModified, res: express.Response) => {
    let { _id, title, content } = req.body
    const time = moment().format('MMM Do YYYY, h:mm a');
    PostModel.findById(_id)
        .then(foundResponse => {
            if (!foundResponse) {
                res.status(404).json({ message: "Post not found" })
            }

            if (foundResponse?.postedBy.username !== req.user.username) {
                return res.status(401).json({ message: "Unauthorized activity." })
            }

            PostModel.findByIdAndUpdate(_id, {title: title, content:content, postTime: time+" (edited)" })
            .then(updateResponse => {
                res.status(200).json({ message: "Post updated Successfully.", post:req.body })
            })
            .catch(err => {
                res.json({message:"Something went wrong cannot update..."})
            })
        })

}