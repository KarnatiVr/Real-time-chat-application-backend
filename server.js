const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { openConnection, closeConnection } = require("./config/db");
const {
  registerUser,
  loginUser,
  getUserInfo,
  LogoutUser,
} = require("./CRUD/user");
const createUserCollection = require("./collections/userCollection");
const createMessageCollection = require("./collections/messageCollection");
const createChatCollection = require("./collections/chatCollection");
const {
  fetchContacts,
  fetchContactsMatchSearchParams,
} = require("./CRUD/contacts");
const { insertChat } = require("./CRUD/chat");
const createSessionCollection = require("./collections/sessionCollection");
const cookieParser = require("cookie-parser");
const { verifyJWT } = require("./utils/jwt.utils");
const { verifyToken } = require("./middlewares/verifyToken");
const { refreshToken } = require("./middlewares/refreshToken");
const { insertMessage } = require("./CRUD/message");
const {
  getSocketMappedToUser,
  mapSocketToUser,
} = require("./utils/socket-users");
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
    console.log(result);
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
});
app.get("/getUser", verifyToken, (req, res) => {
  // console.log("get User called");
  // console.log("get user", req.userId);
  getUserInfo(req.userId).then((result) => {
    // console.log("result from get user function", result);
    // console.log('-------------------------------------------------------')
    res.send(result);
  });
});
app.get("/refreshToken", (req, res) => {
  refreshToken(req, res).then((result) => {
    res.clearCookie("accessToken");

    res.cookie("accesstoken", result.accesstoken, {
      httpOnly: true,
      maxAge: 3.154e10,
    });
    res.send(result);
  });
});
app.post("/fetchContacts", verifyToken, (req, res) => {
  // const { id } = req.body;
  // console.log(id)
  // console.log(req.body);
  fetchContacts(req.userId).then((result) => {
    // console.log("result", result)

    res.send(result);
  });
});

app.post("/fetchContactsMatchSearchParam", verifyToken, (req, res) => {
  const { searchParam } = req.body;
  console.log(req.body);
  console.log(searchParam);
  fetchContactsMatchSearchParams(searchParam).then((result) => {
    res.send(result);
  });
});

app.post("/createChat", verifyToken, (req, res) => {
  const { chat_name, users } = req.body;
  console.log(req.body);
  insertChat(chat_name, users).then((result) => {
    res.send(result);
  });
});

app.get("/logout", verifyToken, (req, res) => {
  LogoutUser(req.userId).then((result) => {
    if (result) {
      res.clearCookie("accesstoken");
      res.clearCookie("refreshtoken");
      res.send(true);
    }
  });
});
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
  console.log("user connected");
  console.log("socket id =>", socket.id);

  //  Join Room
  socket.on("joinRoom", (data) => {
    console.log("join room called");
    // console.log(socket.id);
    socket.join(data);
  });

  socket.on("message", (data) => {
    console.log(socket.id);
    console.log(data);
  });

  socket.on("send-message", (data) => {
    const { chat_id, sender, receiver, message } = data;
    console.log(data)
    insertMessage(chat_id, sender, receiver, message).then((res) => {
      if (res!==null) {
        console.log("message saved");
        io.to(data.receiver).emit("receive-message", {_id:res,...data});
      }
    });
  });
});
