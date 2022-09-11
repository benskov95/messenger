const express = require("express")
const socketIo = require("socket.io")
const https = require("http")
const PORT = process.env.PORT || 9000;

const app = express();
const server = https.createServer(app);

const io = socketIo(server,{ 
    cors: {
      origin: "*"
    }
}) 

app.get('/', function(_, res) {
    res.sendFile(__dirname + '/index.html');
  });

io.on("connection", (socket) => { 

    socket.on("join", (roomId) => {
        socket.join(roomId);
    })

    socket.on("request", (username) => {
        socket.broadcast.emit(username);
    })

    socket.on("startTyping", () => {
        socket.broadcast.emit("isTyping")
    })

    socket.on("newMsg", (username, receiver) => {
        console.log("Message sent by:", username, "to:", receiver);
        socket.broadcast.emit("reload");
    })
    
    socket.on("end", () => {
        socket.disconnect();
    })
});

server.listen(PORT, err => {
 if(err) console.log(err)
 console.log("Server running on port", PORT)
})