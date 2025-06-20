require('dotenv').config(); // Nạp biến môi trường

const express = require('express');
const path = require('path');
const connectDB = require('./config/db')
const apiRouter = require('./routes/authoRoute');
const speciesRoute = require('./routes/SpeciesRoute'); 


const app = express();
const PORT = process.env.PORT || 3000;
connectDB()


// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api', apiRouter);
app.use('/api/species', speciesRoute); 


// Routes HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/uploadFile', (req, res) => res.sendFile(path.join(__dirname, 'views', 'upload_file.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));
app.get('/species', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'species.html'));});
app.get('/add-species', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'add_species.html'));});



// Middleware lỗi
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send('Something broke on the server!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
