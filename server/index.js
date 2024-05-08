const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 5000;
const cors = require("cors");
const { connectDb } = require("./db/connection");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
require("dotenv").config();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

connectDb();

app.get("/", (req, res) => {
  res.send("<center> <h1>Hello world</h1> </center>");
});

app.use("/api", require("./routes/route"));

// STARTING THE LOGIC OF CHAT APP
// Store connected users' sockets with their email addresses
const users = {};
io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  // Send a welcome message to the connected client
  socket.emit("welcome", `Welcome to the chat server ${socket.id}`);

  // Handle the initiate-chat event

  socket.on("initiate-chat", ({ senderEmail, recipientEmail }) => {
    // Store the recipient's socket id
    users[senderEmail] = socket.id;
    console.log(
      Object.keys(users).length,
      " is the numbers of users connected"
    );
    // Notify the recipient about the new user
    if (users[recipientEmail]) {
      // Notify both the sender and recipient that the chat is initiated
      io.to(users[senderEmail]).emit("chat-initiated", recipientEmail);
      io.to(users[recipientEmail]).emit("chat-initiated", senderEmail);
    } else {
      // Handle offline user
      console.log(`User ${recipientEmail} is offline.`);
      // Emit an event back to the sender indicating the recipient is offline
      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }
  });

  // Handle sending messages
  socket.on("send-message", ({ senderEmail, recipientEmail, message }) => {
    // Send the message to the receiver
    console.log({
      senderEmail,
      recipientEmail,
      message,
    });
    if (users[recipientEmail]) {
      // Send the message only to the recipient
      io.to(users[recipientEmail]).emit("receive-message", {
        senderEmail,
        message,
      });
    } else {
      // Handle offline user
      console.log(`User ${recipientEmail} is offline.`);
      // Emit an event back to the sender indicating the recipient is offline
      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
    // Remove the socket id from the users object
    const email = Object.keys(users).find((key) => users[key] === socket.id);
    if (email) {
      delete users[email];
    }
  });
});

server.listen(port, () => console.log(` Server is running on port ${port}`));
