import express from "express";
import config from "config";
import { connectToDb } from "./db.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();

const PORT = config.get("port") || 5000;

app.use(fileUpload({}));
app.use(express.json());
app.use(express.static("static"));
app.use(cors());
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        await connectToDb();
    } catch (e) {}
};

start();
