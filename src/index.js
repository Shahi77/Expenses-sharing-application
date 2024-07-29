import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/connect.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.error("\nError while connecting to the server: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log("\nServer connected on port: ", port);
    });
  })
  .catch((error) => {
    console.error("\nMongoDB connection failed: ", error);
  });
