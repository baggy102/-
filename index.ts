import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import indexRouter from "./routes/errands";
import multer, { Multer } from "multer";

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
      "http://13.125.221.221",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY as string,
    sameSite: "None",
    cookie: { maxAge: 60 * 6000 * 24 },
  })
);

app.use("/api", indexRouter);

// app.use((err: Error, req: Request, res: Response) => {})

app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`);
});
