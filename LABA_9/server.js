const express = require('express');
const path = require('path');
const cities = require('./js/cities');

const app = express();
const PORT = process.env.PORT || 3000;

// Статика
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// API
app.get('/api/cities/raw', (req, res) => {
  res.json(cities.raw);
});

app.get('/api/cities/processed', (req, res) => {
  res.json(cities.processed());
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});