const { MongoClient, ServerApiVersion } = require("mongodb");

// Connection URI
const uri =
  "mongodb+srv://mernchat:KQS6JxfdbJznNFgg@cluster0.xapm3mf.mongodb.net/?retryWrites=true&w=majority";

// Database Name
const dbName = "ChatApp";

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// Connect to MongoDB
async function openConnection() {
  try {
    await client.connect().then(() => {
      console.log("Connected successfully to server");
    })
  } catch (error) {
    console.log(error);
  }
}

async function closeConnection() {
  await client.close();
}


module.exports = { client, dbName, openConnection, closeConnection }