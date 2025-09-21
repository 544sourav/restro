const prisma =  require("../configure/prisma");

exports.create_menu =async(req,res)=>{
    try{
        const {name, category, price} = req.body;
        const {branchId} = req.params;
        if(!name || !category || !price || !branchId){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            });
        }
        const menu = await prisma.menu.create({
            data : {
                name,
                category,
                price,
                branchId : parseInt(branchId)
            }
        })
        if(!menu){
            return res.status(500).json({
                success:false,
                message:"menu creation failed"
            })
        }
        return res.status(201).json({
            success:true,
            message:"menu created successfully",
            menu
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"server issue try again later"
        });
    }
}
exports.get_branch_menus = async(req,res)=>{
    try{
        const {branchId} = req.params;
        if(!branchId){
            return res.status(400).json({
                success:false,
                message:"some thing is wrong"
            });
        }
        const menus = await prisma.menu.findMany({
            where : {
                branchId : parseInt(branchId)
            }
        });
        if(!menus){
            return res.status(404).json({
                success:false,
                message:"no menus found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"menus fetched successfully",
            menus
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"server issue try again later"
        });
    }
}