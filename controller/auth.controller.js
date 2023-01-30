var express = require("express");
const Users = require("../models/users.model");
const Tokens = require("../models/token.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

async function register(req, res, next) {
  try {
    const payload = req.body;
    if(!req.body.password){
        return res.status(400).send({message: "Password is required"})
    }
    const hashValue = await bcrypt.hash(payload.password,10);
    payload.hashedPassword = hashValue;
    delete payload.password;

    let newUser = new Users(payload);//validating the payload for checking the models schema
    newUser.save((err,data)=>{
        if(err){
            return res.status(400).send({message:"Error while registering the user"})
        }
        res.status(201).send({message:"User has been registered successfully",uId: data._id});
    });
  } catch (error) {
    res.status(500).send({message:"Something went wrong"})
  }
}

async function signin(req, res, next) {
  try {
    const {email, password} = req.body;
    const existingUser = await Users.findOne({email:email});

    if(existingUser){
     const isValidUser = await bcrypt.compare(password,existingUser.hashedPassword);

     if(isValidUser){
     const token = await jwt.sign({_id: existingUser._id},process.env.JWT_SECRET);
    //  res.cookie("accessToken",token,{
    //   sameSite: "strict",
    //   path: "/",
    //   httpOnly: true
    //  })

    res.cookie("accessToken",token,{expire: new Date() + 86400000})
     return res.status(201).send({message:"User signed-in successfully"})
     }
     return res.status(401).send({message:"Invalid credential"});

    }
    res.status(400).send({message:"User doesnot exist"})
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Something went wrong"})
  }
}

async function signout(req, res, next) {
  try {
    await res.clearCookie("accessToken");
    res.status(200).send({message:"User signed out successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Something went wrong"})

  }
}

const forgotPassword = async (req,res) => {
  try {
    const { email } = req.body;
    if(!email){
      return res.status(400).send({message: "Email is mandatory"});
    }

    const user = await Users.findOne({email: email});
    if(!user){
      return res.status(400).send({message: "User does not exist"});
    }

    const token = await Tokens.findOne({userId: user._id});
    if(token){
      await token.deleteOne();
    }

    let newToken = crypto.randomBytes(32).toString("hex");
    const hashedToken =  await bcrypt.hash(newToken,10);
    const tokenPayload = new Tokens({userId: user._id, token: hashedToken, createdAt: Date.now()})
    await tokenPayload.save();

    const link = `http://localhost:3001/passwordReset?token=${newToken}&id=${user._id}`

     await sendEmail(user.email, "Password Reset Link", {name: user.name, link: link})

    // if(isSend){
    //   return res.status(500).send({message: "Internal server error"});
    // }
   return res.status(200).send({message: "Email has been send successfully"})

  } catch (error) {
    console.log(error);
    res.status(500).send({message: "Internal server error"})
  }
}

const resetPassword = async (req,res) => {
  try {
    const {userId, token, password} = req.body;

    let resetToken = await Tokens.findOne({userId: userId});
    if(!resetToken){
      return res.status(401).send({message: "Invalid or expired Token!"})
    }
    const isValid = await bcrypt.compare(token, resetToken.token);

    if(!isValid){
      return res.status(400).send({message: "Invalid Token"})
    }
    const hashedPassword = await bcrypt.hash(password,10);
     Users.findByIdAndUpdate({_id: userId},{$set: {hashedPassword: hashedPassword}}, (err, data) => {
      if(err){
        return res.status(400).send({message: "Error while resetting password.."})

      }
    })

    await resetToken.deleteOne();
    return res.status(200).send({message: "Password has been reset sucessfully.."})
  } catch (error) {
    console.log(error);
  }
}

module.exports = {register,signin,signout,forgotPassword, resetPassword}
