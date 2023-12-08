const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("./Blacklist");

const auth = async(req,res,next)=>{
    
    try {
        let token = req.headers.authorization?.split(" ")[1];
       
        if(!token){
           throw new Error("Not authorized to access this resorce")
        }

        const isTokenBlacklist = await BlacklistModel.findOne({token});
        if(isTokenBlacklist){
           throw new Error("please login again")

        }

        token = req.headers.authorization?.split(" ")[1];
        const isTokenValid = await jwt.verify(token,"token");
        
        if(!isTokenValid){
            throw new Error("Invalid token");
        }

        req.body.username=isTokenValid.username;
        req.body.userId =isTokenValid.userId;
        next();
    } catch (error) {
       return res.status(400).send({error:error.message})
    }
};
module.exports={auth}