const {
  client,
  dbName,
} = require("../config/db");

async function fetchContacts(id) {
  console.log("fetch contacts called");

  const userId = id;
  try {
    const contacts = await client
      .db(dbName)
      .collection("chats")
      .aggregate([
        {
          $match: {
            users: userId,
          },
        },
        {
          $unwind: "$users",
        },
        {
          $match: {
            users: { $ne: userId },
          },
        },
        {
          $group: {
            _id: null,
            contacts: { $addToSet: "$users" },
          },
        },
      ]);

    // Extract the contacts array from the result
    const contactUserIds = contacts.length > 0 ? contacts[0].contacts : [];
    return contactUserIds;
  } catch (error) {
    console.log(error);
  } 
}

async function fetchContactsMatchSearchParams(searchParam) {

  try {
    const users = await client
      .db(dbName)
      .collection("users")
      .find({
        name: { $regex: searchParam, $options: "i" }, // Case-insensitive username search
      })
      .toArray();
    console.log(users)
    return users;
  } catch (error) {
    console.log(error);
  } 
}

module.exports = { fetchContacts, fetchContactsMatchSearchParams };
