import express from "express";
const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
