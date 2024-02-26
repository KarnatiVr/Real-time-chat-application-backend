const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { openConnection,closeConnection }= require("./config/db");
const { registerUser, loginUser } = require("./CRUD/user");
const createUserCollection= require("./collections/userCollection");
const createMessageCollection = require("./collections/messageCollection");
const createChatCollection = require("./collections/chatCollection");
const { fetchContacts, fetchContactsMatchSearchParams } = require("./CRUD/contacts");
const { insertChat } = require("./CRUD/chat");
const createSessionCollection = require("./collections/sessionCollection");
const cookieParser = require("cookie-parser");
const { verifyJWT } = require("./utils/jwt.utils");
const { verifyToken } = require("./middlewares/verifyToken");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  registerUser(name, email, password).then((result) => {
    res.send(result);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  loginUser(email, password).then((result) => {
    console.log(result)
    const { accesstoken, refreshtoken, session, loggedInUser } = result;
    // res.cookie("accesstoken", accesstoken, {
    //   httpOnly: true,
    //   maxAge: 5000000,
    // })
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      maxAge: 3.154e10,
    });
    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      maxAge: 3.154e10,
    });
    res.send({ loggedInUser, session });
  });
})
app.post("/fetchContacts", verifyToken, (req, res) => {
  const { id } = req.body;
  console.log(id)
  console.log(req.body);
  fetchContacts(id).then((result) => {
    // console.log("result", result)
    res.send(result);
  });
});

app.post("/fetchContactsMatchSearchParam",verifyToken, (req, res) => {
  const { searchParam } = req.body;
  console.log(req.body)
  console.log(searchParam)
  fetchContactsMatchSearchParams(searchParam).then((result) => {
    res.send(result);
  });
});

app.post("/createChat",verifyToken, (req, res) => {
  const { chat_name, users } = req.body;
  console.log(req.body)
  insertChat(chat_name, users).then((result) => {
    res.send(result);
  })
})
const PORT = 4000;

const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await openConnection();
  await createUserCollection();
  await createMessageCollection();
  await createChatCollection();
  await createSessionCollection();
  // await closeConnection();
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  // console.log(socket.id)
  socket.on("message", (data) => {
    console.log(data)
    socket.broadcast.emit("server-message", data);
  });
});
