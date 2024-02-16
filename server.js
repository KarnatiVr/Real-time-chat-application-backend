const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { openConnection,closeConnection }= require("./config/db");
const { registerUser } = require("./CRUD/user");
const createUserCollection= require("./collections/userCollection");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  registerUser(name, email, password).then((result) => {
    res.send(result);
  });
});

const PORT = 4000;

const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await openConnection();
  await createUserCollection();
  await closeConnection();
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
    // console.log(data)
    socket.broadcast.emit("server-message", data);
  });
});
