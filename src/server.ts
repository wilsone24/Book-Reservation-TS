import createApp from "./app";
import handleMongoConnection from "./db";
import dotenv from "dotenv";

dotenv.config();
const app = createApp();
handleMongoConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
