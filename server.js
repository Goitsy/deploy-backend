import express from "express";
import cors from "cors";
import "dotenv/config";
import connect from "./libs/database.js";
import Todo from "./models/Todo.js";
import morgan from "morgan";

await connect();
const port = process.env.PORT || 8089; // Ensure PORT is set correctly

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL, // Ensure this is set to the correct frontend URL
  })
);
app.use(express.json());
app.use(morgan("dev"));

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
