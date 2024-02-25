const { client, dbName } = require("../config/db");

async function createChatCollection() {
  const collections = await client
    .db(dbName)
    .listCollections({ name: "chats" })
    .toArray();
  const doesCollectionExist = collections.length > 0;
  console.log(doesCollectionExist);
  if (!doesCollectionExist) {
    await client.db(dbName).createCollection("chats", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["chat_name", "users"],
          properties: {
            chat_name: {
              bsonType: "string",
              description: "must be a string",
            },
            users: {
              bsonType: "array",
              description: "must be an array of two user ObjectIds",
              items: {
                bsonType: "objectId",
              },
              minItems: 2,
              maxItems: 2,
            },
            messages: {
              bsonType: "array",
              description: "must be an array of references to messages",
              items: {
                bsonType: "objectId",
              },
            },
            // createdAt: {
            //   bsonType: "date",
            //   description: "must be a date",
            // },
          },
        },
      },
    });
  }
}

module.exports = createChatCollection;
