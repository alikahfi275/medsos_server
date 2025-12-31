import "dotenv/config";
import express from "express";

import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
