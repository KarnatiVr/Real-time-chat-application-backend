const { client, dbName } = require("../config/db");

async function createUserCollection() {
  const collections = await client
    .db(dbName)
    .listCollections({ name: "users" })
    .toArray();
  const doesCollectionExist = collections.length > 0;
  console.log(doesCollectionExist);
  if (!doesCollectionExist) {
    await client.db(dbName).createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email", "password"], // Add "password" to the list of required fields
          properties: {
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
            password: {
              bsonType: "string", // Assuming password is stored as a string
              minLength: 6, // Example: Password must be at least 6 characters long
              description: "must be a string and meet additional criteria",
            },
          },
        },
      },
    });
  }
}

module.exports = createUserCollection;
