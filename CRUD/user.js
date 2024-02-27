const {
  client,
  dbName,
} = require("../config/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds=10;
const { signJWT, verifyJWT } = require("../utils/jwt.utils");
const { createSession } = require("../utils/sessions.utils");
async function registerUser(name, email, password) {
  console.log("register user called");

  console.log(name, email, password);
  try {
    const existingUser = await client
      .db(dbName)
      .collection("users")
      .findOne({ email });
    if (existingUser) {
      console.log("user already exists");
      console.log("please login");
      return
    }

    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await client
      .db(dbName)
      .collection("users")
      .insertOne({ name, email, password:hashedPassword });
    return result;
  } catch (error) {
    console.log(error);
  } 
}

async function loginUser(email, password) {
  console.log("login user called");
  try {
    const user = await client
      .db(dbName)
      .collection("users")
      .findOne({ email });
    if (!user) {
      console.log('User doesnt exist please register')
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("password is invalid")
      return null;
    }


    const session = await createSession({ userID: user._id, name: user.name, email: user.email });
    console.log("session",session)
    const accesstoken = await signJWT({ userId: user._id },"10s");
    const refreshtoken = await signJWT({ session: session.insertedId }, "1y");

    const loggedInUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }

     return {
       session: session,
       loggedInUser: loggedInUser,
       accesstoken:accesstoken,
       refreshtoken:refreshtoken
     }

  } catch (error) {
    console.log(error);
  } 
}

async function getUserInfo(userId){
  const user= await client.db(dbName).collection("users").findOne({_id:new ObjectId(userId)})
  return {
    _id: user._id,
    name: user.name,
    email: user.email
  }
}

module.exports = { registerUser, loginUser, getUserInfo };
