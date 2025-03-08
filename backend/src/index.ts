import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import logger from "./middleware/logger";
dotenv.config()

const PORT = process.env.PORT || 8000;
const app: Express = express();
app.use(express.json());
app.use(logger);
app.use("/api", routes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})