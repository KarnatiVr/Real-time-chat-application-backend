const { client, dbName } = require("../config/db");
const ObjectId = require("mongodb").ObjectId;

async function insertMessage(chat_id, sender_id, receiver_id, message) {
  console.log("insert message called");
  try {
    const result = await client
      .db(dbName)
      .collection("messages")
      .insertOne({
        sender: new ObjectId(sender_id),
        receiver: new ObjectId(receiver_id),
        message: message,
        isRead: false,
      });
    const { insertedId } = result; // Assuming 'result' contains the result of inserting the message
    const result2 = await client
      .db(dbName)
      .collection("chats")
      .updateOne(
        { _id: new ObjectId(chat_id) },
        { $push: { messages: new ObjectId(insertedId) } }
      );
    return result.insertedId?result.insertedId:null;
  } catch (error) {
    console.log(error);
  }
}

async function setReadMessageTrue(chat_id)
{
  const chat = await client.db(dbName).collection("chats").findOne({_id:new ObjectId(chat_id)})
  console.log("chat =>", chat)
  chat.messages?.map( async (message)=>{
    console.log("message =>", message)
    await client.db(dbName).collection("messages").updateOne({_id: message},{$set:{ isRead: true }})
  })
}


module.exports = { insertMessage, setReadMessageTrue }