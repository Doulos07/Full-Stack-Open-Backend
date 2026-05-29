const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/", (request, response) => {
  response.end("<h1>Hello Word</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
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
  const total = persons.length;
  const time = new Date();
  res.send(`
    <p>Phonebook has info for ${total} people </p>
    <p>${time}</p>`);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running port ${PORT}`);
});
