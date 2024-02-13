const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors())

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})

const PORT=4000;

const server=app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const io=require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on("message", (data) => {
        console.log(data)
        io.emit("server-message", data)
    })
})