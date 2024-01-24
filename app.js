const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_application'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM todos';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { todos: results });
    });
});

app.post('/add', (req, res) => {
    const { content } = req.body;
    const sql = 'INSERT INTO todos (content) VALUES (?)';
    db.query(sql, [content], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM todos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.render('edit', { todo: result[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const sql = 'UPDATE todos SET content = ? WHERE id = ?';
    db.query(sql, [content, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});