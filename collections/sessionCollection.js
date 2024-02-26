const { client, dbName } = require("../config/db");

async function createSessionCollection() {
  const collections = await client
    .db(dbName)
    .listCollections({ name: "sessions" })
    .toArray();
  const doesCollectionExist = collections.length > 0;
  console.log(doesCollectionExist);
  if (!doesCollectionExist) {
    await client.db(dbName).createCollection("sessions", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userID","name", "email", "valid"], // Add "password" to the list of required fields
          properties: {
            userID: {
                bsonType: "objectId",
                description: "must be an objectId refers to user model",
            },
            name: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            email: {
              bsonType: "string",
              pattern: "^\\S+@\\S+\\.\\S+$",
              description:
                "must be a string and match the regular expression pattern",
            },
            valid: {
              bsonType: "bool",
              description: "must be a boolean",
            }
          },
        },
      },
    });
  }
}

module.exports = createSessionCollection;
