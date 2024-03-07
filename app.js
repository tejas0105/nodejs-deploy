import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes.js";
import connectDB from "./connect.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", router);

dotenv.config({ path: ".env" });

const DB = process.env.MONGO_URI?.replace("<PASSWORD>", process.env.PASSWORD);

const startServer = async () => {
  try {
    await connectDB(DB);
    console.log("DB connected");
    const port = 8000 || process.env.PORT;
    app.listen(port, () => {
      console.log(`Server started at http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

startServer();
