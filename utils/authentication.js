const {expressjwt} = require("express-jwt");
const jwt = require("jsonwebtoken");

// exports.requireSignin = expressjwt({
//     secret: process.env.JWT_SECRET,
//     algorithms: ["HS256"],
//     userProperty: "auth"
// });

exports.isAuth = (req,res,next) => {
    const {cookies} = req;
    // let user = req.auth._id;
    const data = jwt.verify(cookies.accessToken, process.env.JWT_SECRET)
    req.id = data._id;

    if(!req.id){
        return res.status(401).send({message: "Not authorised"});
    }

    next();
}