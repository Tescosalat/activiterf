import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";

const hostname = "localhost";

const port = 3001;

const app = next({
  dev,
  hostname,
  port,
});

const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`Client left room: ${room}`);
    });

    socket.on("message", ({ message, room }) => {
      console.log("Message received:", message, "Room:", room);
      io.to(room).emit("message", message); 
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is listening on http://${hostname}:${port}`);
  });
});
