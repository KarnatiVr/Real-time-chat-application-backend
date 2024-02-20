const {
  client,
  dbName,
} = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds=10;

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
     const token = jwt.sign({ userId: user._id }, "Mern-Chat-Application", {
       expiresIn: "1h",
     });
     return {
       _id: user._id,
       name: user.name,
       email: user.email,
       token
     }

  } catch (error) {
    console.log(error);
  } 
}

module.exports = { registerUser, loginUser };
