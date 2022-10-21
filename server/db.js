import mongoose from "mongoose";
import config from "config";

export const connectToDb = () => {
    const dbUri = config.get("dbUri");

    return mongoose
        .connect(dbUri)
        .then(console.log(`Connected to a DB`))
        .catch((e) => {
            console.error(`Could not connect to a DB`);
            process.exit(1);
        });
};
