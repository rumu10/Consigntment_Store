const express = require('express');
const mysql = require('mysql');
const serverlessHttp = require('serverless-http');

const app = express();

// MySQL Connection Configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

app.use(express.json());

app.post('/endpoint', (req, res) => {
    const body = req.body;
    // Do something with the body
    res.send({ received: true, body: body });
});

app.post('/test', (req, res) => {
    const body = req.body;
    // Do something with the body
    res.send({ received: true, body: body, test: true, lol: "lol" });
});

app.get('/test_db', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        connection.query('SELECT 1', (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to query the database.' });
                return;
            }

            res.send({ status: 'success', message: 'Successfully connected to the database.' });
        });
    });
});

module.exports.server = serverlessHttp(app);

