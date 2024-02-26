const { client, dbName } = require("../config/db");


async function createSession({ userID, name, email }) {
    try {
        const session = await client
            .db(dbName)
            .collection("sessions")
            .insertOne({ userID, name, email, valid: true });
        return session;
    } catch (error) {
        console.log(error);
    }

}


async function deleteSession(sessionId) {
    try {
        const session = await client.db(dbName).collection("sessions").deleteOne({ _id: new ObjectId(sessionId) });

        return session
    }
    catch (error) {
        console.log(error);
    }
}

async function getSession(sessionId) {
    try {
        const session = await client
            .db(dbName)
            .collection("sessions")
            .findOne({ _id: new ObjectId(sessionId) });
        return session;
    } catch (error) {
        console.log(error);
    }
}

module.exports= {
    createSession,
    deleteSession,
    getSession}