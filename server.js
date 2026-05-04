const express = require("express");
const server = express();

server.use(express.json());

const TASK_STATES = ["To Do", "In Progress", "Completed"];

let taskList = [
  {
    id: 1,
    title: "Go to SUST",
    description: "Exam purpose",
    status: "To Do",
    createdAt: new Date().toISOString(),
  },
];

let idCount = 2;

const validateTask = (data, isUpdate = false) => {
  const issues = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      issues.push("Title must be a non-empty string.");
    }
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    issues.push("Description must be a string.");
  }

  if (data.status !== undefined && !TASK_STATES.includes(data.status)) {
    issues.push(`Status must be one of: ${TASK_STATES.join(", ")}`);
  }

  return issues;
};

server.get("/", (req, res) => {
  res.json({
    message: "Task Manager API running",
    endpoints: {
      allTasks: "/tasks",
    },
  });
});

server.get("/tasks", (req, res) => {
  let output = [...taskList];
  const { status, keyword, order } = req.query;

  if (status) {
    output = output.filter(
      (t) => t.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (keyword) {
    const key = keyword.toLowerCase();
    output = output.filter(
      (t) =>
        t.title.toLowerCase().includes(key) ||
        t.description.toLowerCase().includes(key)
    );
  }

  if (order === "asc" || order === "desc") {
    output.sort((a, b) => {
      return order === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  res.json({
    total: taskList.length,
    resultCount: output.length,
    tasks: output,
  });
});

server.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "ID must be numeric" });
  }

  const found = taskList.find((t) => t.id === id);

  if (!found) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(found);
});

server.post("/tasks", (req, res) => {
  const errors = validateTask(req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const task = {
    id: idCount++,
    title: req.body.title.trim(),
    description: req.body.description?.trim() || "",
    status: req.body.status || "To Do",
    createdAt: new Date().toISOString(),
  };

  taskList.push(task);

  res.status(201).json(task);
});

server.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = taskList.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const errors = validateTask(req.body, true);

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const current = taskList[index];

  taskList[index] = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(taskList[index]);
});

server.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = taskList.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const removed = taskList.splice(index, 1);

  res.json({
    message: "Deleted successfully",
    data: removed[0],
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});