// RESTful Student API using Node.js and Express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON request bodies
app.use(express.json());

// Middleware: log every request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// In-memory data store
let students = [
  { id: 1, name: 'Arun', mark: 82 },
  { id: 2, name: 'Divya', mark: 91 },
  { id: 3, name: 'Karthik', mark: 35 }
];
let nextId = 4;

// Validate request body; returns an error message or null
function validate(body) {
  if (typeof body.name !== 'string' || body.name.trim().length < 2) {
    return 'name must be a string of at least 2 characters';
  }
  if (typeof body.mark !== 'number' || body.mark < 0 || body.mark > 100) {
    return 'mark must be a number between 0 and 100';
  }
  return null;
}

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Student API is running', endpoints: '/students' });
});

// READ all (supports ?search=name)
app.get('/students', (req, res) => {
  const { search } = req.query;
  const result = search
    ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : students;
  res.status(200).json(result);
});

// READ one
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.status(200).json(student);
});

// CREATE
app.post('/students', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const student = { id: nextId++, name: req.body.name.trim(), mark: req.body.mark };
  students.push(student);
  res.status(201).json(student);
});

// UPDATE
app.put('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  student.name = req.body.name.trim();
  student.mark = req.body.mark;
  res.status(200).json(student);
});

// DELETE
app.delete('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Student not found' });
  const removed = students.splice(index, 1)[0];
  res.status(200).json({ message: 'Student deleted', student: removed });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
