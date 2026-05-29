require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const { now } = require("mongoose");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/", (request, response) => {
  response.end("<h1>Hello Word</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      res.status(404).send();
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  if (persons.some((p) => p.name === body.name)) {
    return res.status(404).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.put("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ error: "person not found" });
  }

  const updatedPerson = {
    ...person,
    name: body.name,
    number: body.number,
  };

  persons = persons.map((p) => (p.id === id ? updatedPerson : p));

  res.json(updatedPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletePerson = persons.find((person) => person.id === id);
  if (!deletePerson) {
    return res.status(404).json({ error: "person not found" });
  }

  persons = persons.filter((person) => person.id !== id);

  res.json(deletePerson);
});

app.get("/info", (req, res) => {
  const time = new Date().toISOString();
  Person.find({}).then((result) => {
    res.send(`
    <p>Phonebook has info for ${result.length} people </p>
    <p>${time}</p>`);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running port ${PORT}`);
});
