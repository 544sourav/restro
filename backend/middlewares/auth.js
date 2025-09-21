const jwt = require("jsonwebtoken");
const prisma = require("../configure/prisma");
require('dotenv').config();

exports.auth =async(req,res,next)=>{
    try{
        // console.log("req.headers:", req.headers); // Debugging line to check headers
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        // console.log("Token:", token); // Debugging line to check the token value
        if(!token){
            return res.status(400).json({
                success:false,
                message:"token is missing"
            })
        }
        try{
            const decode = await jwt.verify(token,process.env.JWTSECRET)
            console.log(decode);
            req.user = decode;
        }
        catch(err){
            return res.status(400).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
          success: false,
          message: "Some thing went wrong while token validation",
        });
    }
}
exports.isCelestial = async(req,res,next)=>{
    try{
        const userDetails = await prisma.user.findUnique({where:{email:req.user.email}})
        if(userDetails.role !=="CELESTIAL"){
            return res.status(401).json({
                success:false,
                message:"This route is protected for Celestial"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be accessed"
        })
    }
}
exports.isAdmin = async(req,res,next)=>{
    try{
        const userDetails = await prisma.user.findUnique({where:{email:req.user.email}})
        if(userDetails.role !=="ADMIN"){
            return res.status(401).json({
                success:false,
                message:"This route is protected for Admin"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be accessed"
        })
    }
}
exports.isManager = async(req,res,next)=>{
    try{
        const userDetails = await prisma.user.findUnique({where:{email:req.user.email}})
        if(userDetails.role !=="MANAGER"){
            return res.status(401).json({
                success:false,
                message:"This route is protected for Manager"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be accessed"
        })
    }
}