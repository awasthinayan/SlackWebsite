import router from "./Routers/userRoutes.js";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import cors from "cors";
import bodyParser from "body-parser";
import { PORT } from "./config/serverConfig.js";
import bullserverAdapter from "./config/BullBoardConfig.js";
import {Server} from "socket.io";
import {createServer} from "http";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/Ui', bullserverAdapter.getRouter());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello world Home");
});


io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

// socket.on('messageFromClient', (data) => {
//   console.log('message from client', data);

//   io.emit('new message', data.toUpperCase());
// });

});

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`) 
});
