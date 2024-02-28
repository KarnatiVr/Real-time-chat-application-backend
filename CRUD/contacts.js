const { use } = require("passport");
const {
  client,
  dbName,
} = require("../config/db");
const { ObjectId } = require("mongodb");
async function fetchContacts(id) {
  console.log("fetch contacts called");

  const userId = new ObjectId(id)
  // console.log(userId)
  try {
        const chat_records = await client.db(dbName)
          .collection("chats")
          .find({
            users: { $elemMatch: { $eq: userId } },
          })
          .toArray();
      // console.log("chat records =>",chat_records)
      const chatPromises = chat_records.map(async (chat)=>{
        const otherUserId = String(chat.users[0]) === String(userId) ? chat.users[1] : chat.users[0];
      //  console.log("chat =>",chat)
      //   console.log("req user id =>",userId)
      //   console.log("other user id =>",otherUserId)
        return {
          _id:chat._id,
          chat_name:chat.chat_name,
          user: await client.db(dbName).collection("users").findOne({ _id: otherUserId }),
          messages: chat.messages?.length > 0 ? await client.db(dbName).collection("messages").find({ _id: { $in: chat.messages } }).toArray() : [],
        }
      })
      const chats = await Promise.all(chatPromises)
      // console.log("chats2",chats)
    // Extract the contacts array from the result
    let chatRecords = chats.length > 0 ? chats : [];
    // console.log("chat records",chatRecords)
    return chatRecords;
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
