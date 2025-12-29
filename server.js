import "dotenv/config";
import express from "express";

import AuthRouter from "./routes/Auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
