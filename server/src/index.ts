import express from "express";

import { prisma } from "./lib/prisma.js";

const app = express(); // Create a web server

// Middleware to parse json bodies of incoming request
// Without this, req.body will be undefined
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "It works!" });
});

// Create a user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ message: "name and email are required" });
    return;
  }

  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    res.status(409).json({ message: "Email already taken" });
    return;
  }

  // create user in database
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  res.status(201).json(user);
});

// Get all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get one user by id
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // All entries from refresh token table will also be deleted
  await prisma.user.delete({
    where: { id: userId },
  });
  res.json({ message: "User deleted" });
});

// Start listening on part 4000
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
