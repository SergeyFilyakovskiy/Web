const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'resource', 'data');
const RAW_FILE = path.join(DATA_DIR, 'raw.json');
const PROC_FILE = path.join(DATA_DIR, 'processed.json');

// ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// helper functions
const capitalize = word =>
  word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word;

function processArray(arr){
  return arr.map(capitalize).sort((a,b)=>a.localeCompare(b, 'ru'));
}

// API

// save array, produce processed, write both to files
app.post('/api/save', (req, res) => {
  if(!Array.isArray(req.body.cities)){
    return res.status(400).json({error: 'cities must be array'});
  }
  const rawArr = req.body.cities;
  const processedArr = processArray(rawArr);

  try {
    fs.writeFileSync(RAW_FILE, JSON.stringify(rawArr, null, 2), 'utf8');
    fs.writeFileSync(PROC_FILE, JSON.stringify(processedArr, null, 2), 'utf8');
    res.json({status: 'ok', rawCount: rawArr.length, procCount: processedArr.length});
  } catch(err){
    console.error(err);
    res.status(500).json({error: 'FS error'});
  }
});

app.get('/api/raw', (req,res) => {
  if(!fs.existsSync(RAW_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8'));
  res.json(data);
});

app.get('/api/processed', (req,res) => {
  if(!fs.existsSync(PROC_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(PROC_FILE, 'utf8'));
  res.json(data);
});

// start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));