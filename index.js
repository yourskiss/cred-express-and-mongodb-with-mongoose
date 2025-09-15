import e from "express";
const app = e();

import { PORT } from "./config/env.js";

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});