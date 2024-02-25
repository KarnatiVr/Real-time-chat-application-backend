const { client, dbName } = require("../config/db");
const ObjectId = require("mongodb").ObjectId;



async function insertChat(chat_name, user_ids) {
    console.log(user_ids)    
    console.log("insert chat called");
    console.log(user_ids)
    try {
        const result = await client
          .db(dbName)
          .collection("chats")
          .insertOne({
            chat_name: chat_name,
            users: [new ObjectId(user_ids[0]), new ObjectId(user_ids[1])],
          });
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { insertChat }