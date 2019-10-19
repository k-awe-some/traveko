import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });
import app from "./app";

/*** APP LISTENER ***/
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
