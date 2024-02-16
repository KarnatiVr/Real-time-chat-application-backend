const {
  openConnection,
  closeConnection,
  client,
  dbName,
} = require("../config/db");

async function registerUser(name, email, password) {
  await openConnection();
  console.log(name, email, password);
  try {
    const result = await client
      .db(dbName)
      .collection("users")
      .insertOne({ name, email, password });
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await closeConnection();
  }
}

module.exports = { registerUser };
