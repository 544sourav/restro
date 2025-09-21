const prisma = require('../configure/prisma');

exports.create_table = async (req,res)=>{
    try{
        const {number, branchId} = req.body;
        if(!number || !branchId){
            return res.status(400).json({
                success:false,
                message : "some thing is wrong"
            });
        }
        const table = await prisma.table.create({
            data : {
                number,
                branchId
            }
        });
        if(!table){
            return res.status(500).json({
                success:false,
                message : "could not create table"
            });
        }
        return res.status(201).json({
            success:true,
            message : "table created successfully",
            table
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message : "Internal server error"
        });
    }
}
exports.get_branch_tables = async (req,res)=>{
    try{
        const {branchId} = req.params;
        if(!branchId){
            return res.status(400).json({
                success:false,
                message : "some thing is wrong"
            });
        }
        const tables = await prisma.table.findMany({
            where : {
                branchId : parseInt(branchId)
            }
        });
        if(!tables){
            return res.status(404).json({
                success:false,
                message : "no tables found"
            });
        }
        return res.status(200).json({
            success:true,
            message : "tables fetched successfully",
            tables
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message : "Internal server error"
        });
    }
}
exports.assign_waiter_to_table = async (req, res) => {
  try {
    let { tableId, waiterId } = req.body;
    const { branchId } = req.params;

    if(!waiterId){
        const userid = req.user.userId;
        if(userid){
            const userDetails = await prisma.user.findUnique({where:{id:userid}});
            if(userDetails && userDetails.role === "WAITER"){
                waiterId = userid;
            }
        }
    }

    if (!tableId || !waiterId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "Missing tableId, waiterId or branchId",
      });
    }

    // Check table exists in branch
    const table = await prisma.table.findFirst({
      where: {
        id: parseInt(tableId),
        branchId: parseInt(branchId),
      },
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found in this branch",
      });
    }

    //  Check waiter exists in same branch & role is WAITER
    const waiter = await prisma.user.findFirst({
      where: {
        id: parseInt(waiterId),
        branchId: parseInt(branchId),
        role: "WAITER",
      },
    });

    if (!waiter) {
      return res.status(404).json({
        success: false,
        message: "Waiter not found in this branch",
      });
    }

    //  Assign waiter to table
    const updatedTable = await prisma.table.update({
      where: { id: parseInt(tableId) },
      data: { waiterId: parseInt(waiterId) },
    });

    return res.status(200).json({
      success: true,
      message: "Waiter assigned to table successfully",
      table: updatedTable,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

