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
app.post('/login', (req, res) => {
    const body = req.body;
    console.log(body);
    res.send({ received: true, body: body });
});

app.get('/stores', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        const query = 'SELECT * FROM storeowners';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the store list from the database.' });
                return;
            }

            res.send({ status: 'success', stores: results });
        });
    });
});


app.post('/stores', (req, res) => {
    const storeData = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'INSERT INTO storeowners SET ?';
        connection.query(query, storeData, (err) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to add store to the database.' });
                return;
            }
            res.send({ status: 'success', message: 'Store added successfully.' });
        });
    });
});

app.delete('/stores/:id', (req, res) => {
    const storeId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'DELETE FROM storeowners WHERE id = ?';
        connection.query(query, [storeId], (err) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to delete store from the database.' });
                return;
            }
            res.send({ status: 'success', message: 'Store deleted successfully.' });
        });
    });
});


app.get('/computers', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT * FROM computers';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }

            res.send({ status: 'success', computers: results });
        });
    });
});

app.post('/computers', (req, res) => {
    const computerData = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'INSERT INTO computers SET ?';
        connection.query(query, computerData, (err) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to add computer to the database.' });
                return;
            }
            res.send({ status: 'success', message: 'Computer added successfully.' });
        });
    });
});

app.delete('/computers/:id', (req, res) => {
    const computerId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'DELETE FROM computers WHERE id = ?';
        connection.query(query, [computerId], (err) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to delete computer from the database.' });
                return;
            }
            res.send({ status: 'success', message: 'Computer deleted successfully.' });
        });
    });
});




app.post('/computers', (req, res) => {
    const computerData = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'INSERT INTO computers SET ?';
        connection.query(query, computerData, (err) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to add computer to the database.' });
                return;
            }
            res.send({ status: 'success', message: 'Computer added successfully.' });
        });
    });
});


// Report total inventory in amount in entire site-fq
app.get('/computers', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT sum(price) FROM computers where status = 1';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }

            res.send({ status: 'success', totalInventory: results });
        });
    });
});

// Report total balance in amount in entire site-fq
app.get('/computers', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT sum(price)*0.95 FROM computers where status = 0';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }

            res.send({ status: 'success', totalBalance: results });
        });
    });
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