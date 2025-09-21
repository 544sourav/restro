const prisma = require("../configure/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWTSECRET } = process.env;

exports.celestial_signin = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: "CELESTIAL" }
        });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(500).json({ error: "User creation failed" });
        }
        user.password = undefined;
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    }
    catch(error){   
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server issue, try again later"
        });
    }
}
exports.create_user = async (req, res) => {
  try {
    const { name, branchId, email, password, accountType } = req.body;

    if (!name || !email || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    if (accountType === "ADMIN") {
      // ADMIN doesn't require branch
    } else if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "BranchId is required for this user",
      });
    }

    const creator_role = req.user.role;

    if (creator_role === "CELESTIAL" && accountType === "ADMIN") {
      // allowed
    } else if (
      creator_role === "ADMIN" &&
      (accountType === "MANAGER" ||
        accountType === "WAITER" ||
        accountType === "CASHIER")
    ) {
      // allowed
    } else if (
      creator_role === "MANAGER" &&
      (accountType === "WAITER" || accountType === "CASHIER")
    ) {
      // allowed
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create this user",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      name,
      email,
      password: hashedPassword,
      role: accountType,
    };

    if (branchId) {
      data.branchId = branchId;
    }

    const newUser = await prisma.user.create({ data });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server issue, try again later",
    });
  }
};

exports.login = async(req, res)=> {
        try{
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: "email " });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }
            const payload = { userId: user.id, email: user.email, role: user.role };
            const token = jwt.sign(
              payload,
              JWTSECRET,
              { expiresIn: "24h" }
            );
            const options = {
              expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            };
            return res.cookie("token",token,options).json({
                success: true,
                data : { 
                    token, 
                    user: { id: user.id, name: user.name, email: user.email, role: user.role }
                }
            });
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
              success: false,
              message: "Server issue, try again later",
            });
        }
}
