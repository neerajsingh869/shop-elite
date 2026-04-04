import express from "express";

const app = express(); // Create a web server

// Middleware to parse json bodies of incoming request
// Without this, req.body will be undefined
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "It works!" });
});

// Start listening on part 4000
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
