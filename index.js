const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// const { instrument } = require("@socket.io/admin-ui");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("HI from Live Classes !");
});

io.on("connection", (socket) => {
  console.log(`New client connected with id ${socket.id}`);

  socket.on("join-class", (classId) => {
    socket.join(classId);
    console.log("rooms size = ", socket.rooms.size);
  });

  socket.on("send-code", ({ classId, newCode }) => {
    if (!classId || !newCode) {
      console.log("Missing classId or newCode");
      return;
    }
    socket.to(classId).emit("receive-code", newCode);
  });

  socket.on("send-output", ({ classId, output }) => {
    if (!classId || !output) {
      console.log("Missing classId or output");
      return;
    }
    socket.to(classId).emit("receive-output", output);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    console.log("rooms size = ", socket.rooms.size);
  });
});

const port = 3001;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`Port ${port} is already in use.`);
  }
});

// exports.app = functions.https.onRequest(app);

// instrument(io, { auth: false });
