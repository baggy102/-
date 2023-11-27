import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import indexRouter from "./routes/errands";
import RedisStore from "connect-redis";
import { redisClient } from "./config/redis";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger-output.json";

const app: Express = express();
const PORT = 8080;
dotenv.config();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://15.164.163.114",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);

redisClient.connect();

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY as string,
    sameSite: "None",
    cookie: { maxAge: 60 * 6000 * 24 },
  })
);

app.use("/api", indexRouter);

app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`);
});
