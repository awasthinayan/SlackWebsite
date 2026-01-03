import router from "./Routers/userRoutes.js";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import cors from "cors";
import bodyParser from "body-parser";
import { PORT } from "./config/serverConfig.js";
import bullserverAdapter from "./config/BullBoardConfig.js";


dotenv.config();

const app = express();

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

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`) 
});
