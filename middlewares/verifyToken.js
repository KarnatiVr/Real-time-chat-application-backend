const { verifyJWT } = require("../utils/jwt.utils");

const verifyToken= (req, res, next) => {
    console.log("verify token called")
    const { accesstoken, refreshtoken } = req.cookies;
    console.log(accesstoken,refreshtoken)
    if (accesstoken) {
      const payload = verifyJWT(accesstoken);
      console.log(payload)
      if (payload!=null) {
        console.log("payload is not null")
        req.user = payload;
        return next();
      }
    }
}

module.exports= {verifyToken}