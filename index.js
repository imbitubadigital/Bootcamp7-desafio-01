const express = require("express");

const app = express();
app.use(express.json());

const projects = [];
let count = 0;
app.use((req, res, next) => {
  console.log(count + 1);
  return next();
});

function countRequest(req, res, next) {
  count++;
  console.log("Total de requisições = " + count);
  return next();
}

app.use(countRequest);

function checkId(req, res, next) {
  const { id } = req.params;
  const check = projects.filter(p => p.id === id);

  if (check.length < 1) {
    return res.json({ message: "Projeto não localizado" });
  }
  return next();
}

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const data = {
    id,
    title,
    tasks: []
  };
  projects.push(data);
  return res.json(projects);
});

app.put("/projects/:index", (req, res) => {
  const { title } = req.body;
  const { index } = req.params;
  projects[index].title = title;
  return res.json(projects);
});

app.delete("/projects/:index", (req, res) => {
  const { index } = req.params;
  projects.splice(index, 1);
  return res.json({ message: "Projeto deletado" });
});

app.post("/projects/:id/task", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.filter(p => {
    if (p.id === id) {
      p.tasks.push(title);
    }
  });
  return res.json(projects);
});

app.listen(3000);
