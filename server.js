import express from "express";
import cors from "cors";
import "dotenv/config";
import connect from "./libs/database.js";
import Todo from "./models/Todo.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

await connect();
const port = process.env.PORT || 8089;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send("Failed to fetch todos");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ todo: req.body.name });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).send("Failed to add Todo");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.send("Todo deleted successfully");
  } catch (err) {
    res.status(500).send("Failed to delete Todo");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
