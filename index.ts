import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import indexRouter from "./routes/errands";
import multer, { Multer } from "multer";

const app = express();
const PORT = 8080;
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://52.62.33.115"],
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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
