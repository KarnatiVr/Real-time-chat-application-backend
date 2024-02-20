const { client, dbName } = require("../config/db");

async function createMessageCollection() {
  const collections = await client
    .db(dbName)
    .listCollections({ name: "messages" })
    .toArray();
  const doesCollectionExist = collections.length > 0;
  console.log(doesCollectionExist);
  if (!doesCollectionExist) {
    await client.db(dbName).createCollection("messages", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["sender", "message", "receiver"],
          properties: {
            sender: {
              bsonType: "objectId",
              description: "must be an objectId refers to user model",
            }, // Assuming sender is ObjectId
            message: { bsonType: "string", description: "must be a string" },
            receiver: {
              bsonType: "objectId",
              description: "must be an objectId refers to user model",
            }, // Assuming receiver is ObjectId
            isRead: {
              bsonType: "bool",
              description: "must be a boolean",
            },
            createdAt: {
              bsonType: "date",
              description: "must be a date",
            },
          },
        },
      },
    });
  }
}

module.exports = createMessageCollection;
