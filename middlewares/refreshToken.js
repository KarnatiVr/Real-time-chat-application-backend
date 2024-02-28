const { verifyJWT, signJWT } = require("../utils/jwt.utils");
const { client, dbName } = require("../config/db");
const { ObjectId } = require("mongodb");

const refreshToken = async (req,res) => {
  console.log("verify token called");
  const { refreshtoken } = req.cookies;
  console.log( refreshtoken);
  if (refreshtoken) {
    const payload = verifyJWT(refreshtoken);
    // console.log(payload);
    if (payload.payload != null) {
      // console.log("payload is not null");
      const sessionId=payload.payload.session
      const session = await client.db(dbName).collection("sessions").findOne({ _id: new ObjectId(sessionId) });
      console.log("session",session);
      if (session?.valid === false) {
        return res.status(500).json({
          message: "Session Expired",
        });
      }
      else{
      const accesstoken = signJWT({ userId: session?.userID }, "10s");
        return {accesstoken:accesstoken}
      }
      // Get the userId
      // sign jwt
      
    } else {
      return res.status(500).json({
        message: "Token Expired",
      });
    }
  }
};

module.exports = { refreshToken };
