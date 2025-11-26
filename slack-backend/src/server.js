import router from "./Routers/userRoutes.js";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3000;

server.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);

connectDB();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/api", router);

server.get("/", (req, res) => {
  res.send("Hello world Home");
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
