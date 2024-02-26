const jwt = require("jsonwebtoken");

const Key = "secret-key";

function signJWT(payload, expiresIn) {
    // console.log(privateKey)
  return jwt.sign(payload, Key, {
   expiresIn,
  });
}

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, Key);
    return {
      valid: true,
      expired: false,
      payload: decoded,
    };
  } catch (err) {
    return {
      expired: err.message.includes("jwt expired"),
      payload: null,
    };
  }
}

module.exports = {
  signJWT,
  verifyJWT,
}