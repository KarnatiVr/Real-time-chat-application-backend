const { verifyJWT } = require("../utils/jwt.utils");

const verifyToken= (req, res, next) => {
    // console.log("verify token called")
    const { accesstoken, refreshtoken } = req.cookies;
    // console.log(accesstoken,refreshtoken)
    if (accesstoken) {
      const payload = verifyJWT(accesstoken);
      // console.log(payload)
      if (payload.payload!=null) {
        // console.log("payload is not null")
        // console.log("verifyToken",payload.payload.userId);
        req.userId = payload.payload.userId;
        return next();
      }
      else{
        return res.status(500).json({
          message: "Token Expired"
        })
      }
    }
    else{
      return res.status(500).json({
        message: "Token Not Found"
      })
    }
}

module.exports= {verifyToken}