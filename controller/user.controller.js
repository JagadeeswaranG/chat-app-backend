const Users = require("../models/users.model");

exports.getUser = async (req,res) => {
    try {
        const id = req.id;
    let user = await Users.findById(id);
    if(user){
        user = user.toObject();//to convert BSON to JSON
        delete user.hashedPassword;//delete user["hashedPassword"];
        return res.status(200).send({success:true, user: user})

    }
    res.status(400).send({success:false, message:"User doesnt exist"})
    } catch (error) {
        console.log(error);
       res.status(500).send({message: "Internal Server Error"});
    }
}