import dotenv from "dotenv";
dotenv.config();
import express = require("express");
import joi = require("joi");
import mongoose from "mongoose";
import UserModel from "../models/UserModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "process";
import { RequestModified } from "../types";
import mv from "mv"

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
    if(!req.file){
        return res.json({auth:false, message: "No Image Found"})
    }
    const { name, email, password, username, confpassword } = req.body;
    JOIschema.validateAsync({ username, name, email, password, confpassword })
    .then((result) => {
        return UserModel.find({ email, username });
    })
    .then((findResponse): any => {
        if(password !== confpassword){
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
                                    expiresIn: 300,
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
                    if (env.JWT_SECRET) {
                        token = jwt.sign({ id: req.user._id }, env.JWT_SECRET, { expiresIn: 300 })
                    }
                    req.user.password = ""
                    res.status(201).json({ auth: true, user: req.user, token, message: "Login Successful" })
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


export const uploadProfile = (req: RequestModified, res: express.Response) => {
}