const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 5000;
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
require("dotenv").config();

app.use("/api", require("./routes/route"));

io.on("connection", (socket) => {
  console.log(`New user : ${socket.id}`);
  socket.emit("welcome", "Welcome to the server");
});

server.listen(port, () => console.log(` Server is running on port ${port}`));
