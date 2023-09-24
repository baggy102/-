const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
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
    secret: process.env.SECRET_KEY,
    sameSite: "None",
    cookie: { maxAge: 60 * 6000 * 24 },
  })
);

const indexRouter = require("./routes/errands");

app.use("/api", indexRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
