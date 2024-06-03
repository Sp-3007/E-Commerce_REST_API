const jwt = require("jsonwebtoken")

module.exports=(req,res,next) => {
    try{
         const token = req.headers.authorization.split(" ")[1];
         console.log(token);
         const decode = jwt.verify(token,process.env.JWT_KEY)
         req.userDataa =decode;
         next();
    }catch(err){
        console.log(err)
        return res.status(401).json({
            message : "Authentication fail"
        })
    }     
    
}