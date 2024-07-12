import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({
  dev,
  hostname,
  port,
});

const handler = app.getRequestHandler();

const uri = 'mongodb+srv://roman:qsBAZAIdmwOEyYuI@cluster0.aaprsao.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let messagesCollection;


async function connectToDatabase() {
  try {
    await client.connect();
    const database = client.db("messages");
    messagesCollection = database.collection("message");
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function startServer() {
  await connectToDatabase();

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

       
        messagesCollection.distinct('to', { from: username })
          .then(toPartners => {
            return messagesCollection.distinct('from', { to: username })
              .then(fromPartners => {
                const allPartners = Array.from(new Set([...toPartners, ...fromPartners]));
                socket.emit('chat_partners', allPartners);
              });
          })
          .catch(error => console.error('Error fetching chat partners from MongoDB:', error));
      });

      socket.on('fetch_messages', async (chatUser) => {
        try {
          const messages = await messagesCollection.find({
            $or: [
              { from: socket.username, to: chatUser },
              { from: chatUser, to: socket.username },
            ]
          }).toArray();
          socket.emit('previous_messages', messages);
        } catch (error) {
          console.error('Error fetching messages from MongoDB:', error);
        }
      });

      socket.on('private_message', async ({ to, message }) => {
        const toSocketId = users[to];
        
        // Save the message to MongoDB
        try {
          await messagesCollection.insertOne({
            from: socket.username,
            to,
            message,
            timestamp: new Date(),
          });
          console.log('Message saved to MongoDB');
        } catch (error) {
          console.error('Error saving message to MongoDB:', error);
        }

        // Send the message to the recipient if they are online
        if (toSocketId) {
          io.to(toSocketId).emit('private_message', {
            from: socket.username,
            message,
          });
          console.log(`Message from ${socket.username} to ${to}: ${message}`);

          // Notify recipient of new chat partner
          io.to(toSocketId).emit('new_chat_partner', socket.username);
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
}

startServer();
