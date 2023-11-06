const { Computer } = require('./models/Computer');
const { Store } = require('./models/Store');
const express = require('express');
const mysql = require('mysql');
const serverlessHttp = require('serverless-http');
const bcrypt = require('bcryptjs');

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

app.post('/login-site-manager', (req, res) => {
    const managerData = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        const userData = `select * from manager where email = '${managerData.email}' `;
        connection.query(userData, async (err, results) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to add store to the database.' });
                return;
            }

            const isEqual = await bcrypt.compare(managerData.password, results[0].password_hash);
            if (isEqual) {
                res.send({ status: 'success', message: 'Login successfully.', data: results[0] });
            }
        });
    });
});

app.post('/login-store-owner', (req, res) => {
    const ownerData = req.body;
    console.log(ownerData)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        const userData = `select * from storeowners where email = '${ownerData.email}' `;
        connection.query(userData, async (err, results) => {
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to add store to the database.' });
                return;
            }

            const isEqual = await bcrypt.compare(ownerData.password, results[0].password_hash);
            if (isEqual) {
                res.send({ status: 'success', message: 'Login successfully.', data: results[0] });
            }
        });
    });
});

app.get('/managers', (req, res) => {
    const managerId = req.query.managerId;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        let managerQuery = `
            SELECT 
                s.manager_id,
                COALESCE(SUM(CASE WHEN c.status = 1 THEN c.price ELSE 0 END), 0) AS total_inventory,
                COALESCE(SUM(CASE WHEN c.status = 0 THEN c.price * 0.95 ELSE 0 END), 0) AS total_balance
            FROM 
                storeowners s
            LEFT JOIN 
                computers c ON s.store_id = c.store_id
        `;

        const queryParams = [];
        if (managerId) {
            managerQuery += ' WHERE s.manager_id = ?';
            queryParams.push(managerId);
        }

        managerQuery += ' GROUP BY s.manager_id';

        connection.query(managerQuery, queryParams, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch manager data from the database.' });
                return;
            }

            res.send({ status: 'success', totals: results });
        });
    });
});



app.get('/stores', (req, res) => {

    const storeId = req.query.storeId;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        let query = `
            SELECT 
                s.store_id,
                s.manager_id,
                s.email,
                s.store_name,
                s.longitude,
                s.latitude,
                COALESCE(SUM(CASE WHEN c.status = 1 THEN c.price ELSE 0 END), 0) AS inventory,
                COALESCE(SUM(CASE WHEN c.status = 0 THEN c.price * 0.95 ELSE 0 END), 0) AS balance
            FROM 
                storeowners s
            LEFT JOIN 
                computers c ON s.store_id = c.store_id
        `;
        const queryParams = [];

        let whereClauses = [];
        if (storeId) {
            whereClauses.push('s.store_id = ?');
            queryParams.push(storeId);
        }


        if (whereClauses.length) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += ' GROUP BY s.store_id';

        connection.query(query, queryParams, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch store data from the database.' });
                return;
            }
            const stores = results.map(data => Store.fromDatabase(data));

            res.send({ status: 'success', stores: stores });
        });
    });
});



app.post('/create-stores', async (req, res) => {
    const HashedPass = await bcrypt.hash(req.body.password_hash, 12);
    console.log(HashedPass)
    req.body.passwordHash = HashedPass;
    console.log(req.body)
    const storeData = new Store(req.body).toDatabase();

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

app.delete('/stores/:store_id', (req, res) => {
    const storeId = req.params.store_id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'DELETE FROM storeowners WHERE store_id = ?';
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

    const computerId = req.query.computerId;
    const storeId = req.query.storeId;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        let query = 'SELECT * FROM computers';
        const queryParams = [];
        if (computerId) {
            query += ' WHERE computer_id = ?';
            queryParams.push(computerId);
        }

        if (storeId) {
            query += ' WHERE store_id = ?';
            queryParams.push(storeId);
        }

        connection.query(query, queryParams, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }
            const computers = results.map(data => Computer.fromDatabase(data));

            const balance = 0.95 * results.reduce((acc, curr) => curr.status === 0 ? acc + curr.price : acc, 0);

            const inventory = results.reduce((acc, curr) => curr.status === 1 ? acc + curr.price : acc, 0);

            res.send({ status: 'success', computers: computers, balance: balance, inventory: inventory });
        });
    });
});

app.post('/computers', (req, res) => {
    const computerData = new Computer(req.body).toDatabase();
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

app.put('/computers/:computerId/status/:status', (req, res) => {
    const computerId = req.params.computerId;
    const status = req.params.status;

    if (typeof status === 'undefined') {
        res.status(400).send({ status: 'error', message: 'Status field is required in the request body.' });
        return;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }

        const query = 'UPDATE computers SET status = ? WHERE computer_id = ?';
        connection.query(query, [status, computerId], (err, result) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to update computer status in the database.' });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).send({ status: 'error', message: 'Computer with the given ID not found.' });
                return;
            }

            res.send({ status: 'success', message: 'Computer status updated successfully.' });
        });
    });
});



app.delete('/computers/:computerId', (req, res) => {
    const computerId = req.params.computerId;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }
        const query = 'DELETE FROM computers WHERE computer_id = ?';
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





// Report total inventory in amount in entire site
app.get('/siteInventory', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT sum(price) as siteInventory FROM computers where status = 1';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }
            
            
            res.send({ status: 'success', siteInventory: results[0]["siteInventory"]});
        });
    });
});

// Report total balance in amount in entire site
app.get('/siteBalance', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT sum(price)*0.95 as siteBalance FROM computers where status = 0';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }

            res.send({ status: 'success', siteBalance: results[0]["siteBalance"] });
        });
    });
});





// Report total inventory in amount in entire site
app.get('/siteInventory', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT sum(price) as siteInventory FROM computers where status = 1';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }
            
            
            res.send({ status: 'success', siteInventory: results[0]["siteInventory"]});
        });
    });
});

// Report total balance in amount in entire site
app.get('/siteBalance', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            res.status(500).send({ status: 'error', message: 'Failed to connect to the database.' });
            return;
        }


        const query = 'SELECT sum(price)*0.95 as siteBalance FROM computers where status = 0';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Database query error:', err);
                res.status(500).send({ status: 'error', message: 'Failed to fetch the computer list from the database.' });
                return;
            }

            res.send({ status: 'success', siteBalance: results[0]["siteBalance"] });
        });
    });
});


function handleErrorAndRespond(connection, err, res, customMessage) {
    connection.release();
    console.error('Database query error:', err);
    res.status(500).send({ status: 'error', message: customMessage });
}

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