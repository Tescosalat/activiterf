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

  const users = {};

  io.on("connection", (socket) => {
    console.log("Client connected");
    
    socket.on('register', (username) => {
        users[username] = socket.id;
        socket.username = username;
        console.log(`${username} registered with id: ${socket.id}`);
    });

       
        socket.on('private_message', ({ to, message }) => {
            const toSocketId = users[to];
            if (toSocketId) {
              io.to(toSocketId).emit('private_message', {
                from: socket.username,
                message,
              });
              console.log(`Message from ${socket.username} to ${to}: ${message}`);
            } else {
              console.log(`User ${to} not found`);
            }
          });



          socket.on("disconnect", () => {
            console.log("Client disconnected");
            for (let username in users) {
              if (users[username] === socket.id) {
                delete users[username];
                break;
              }
            }
          });
        });

  httpServer.listen(port, () => {
    console.log(`Server is listening on http://${hostname}:${port}`);
  });
});
