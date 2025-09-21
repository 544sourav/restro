const prisma = require("../configure/prisma");

exports.create_branch = async (req, res) => {
  try {
    const { name, location } = req.body;
    const adminID = req.user.userId;
    console.log("Admin ID:", adminID);
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    const existingBranch = await prisma.branch.findUnique({
      where: { name },
    });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "branch with this name already exist",
      });
    }
    const newBranch = await prisma.branch.create({
      data: { name, location, adminId: adminID },
    });
    if (!newBranch) {
      return res.status(500).json({
        success: false,
        message: "branch creation failed",
      });
    }
    return res.status(201).json({
      success: true,
      message: "branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server issue try again later",
    });
  }
};
exports.get_all_branches = async (req, res) => {
  try {
    const adminID = req.user.id; 
    const branches = await prisma.branch.findMany({where:{adminID:adminID}});
    return res.status(200).json({
        success: true,
        branches,
        });
    } catch (error) {  
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "server issue try again later",
        });
    }
}