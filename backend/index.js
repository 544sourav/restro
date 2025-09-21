const express = require("express");
const authRoute = require("./routes/Auth");
const branchRoute = require("./routes/Branch");
const tableRoute = require("./routes/Table");
const menuRoute = require("./routes/Menu");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});
// 5432;
app.use(express.json());
app.use(cookieParser());

//routes

app.use("/api/auth", authRoute);
app.use("/api/branch", branchRoute);
app.use("/api/table", tableRoute);
app.use("/api/menu", menuRoute);


app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
