const { Computer } = require("./models/Computer");
const { Store } = require("./models/Store");
const express = require("express");
const mysql = require("mysql");
const serverlessHttp = require("serverless-http");
const bcrypt = require("bcryptjs");
const cors = require("cors");

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
app.use(
  cors({
    origin: "http://makalu-frontend.s3-website-us-east-1.amazonaws.com", // This is your frontend's URL
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  }),
);

app.post("/login-site-manager", (req, res) => {
  const managerData = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    const userData = `select * from manager where email = '${managerData.email}' `;
    connection.query(userData, async (err, results) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to add store to the database.",
        });
        return;
      }

      const isEqual = await bcrypt.compare(
        managerData.password,
        results[0].password_hash,
      );
      if (isEqual) {
        res.send({
          status: "success",
          message: "Login successfully.",
          data: results[0],
        });
      }
    });
  });
});

app.post("/login-store-owner", (req, res) => {
  const ownerData = req.body;
  console.log(ownerData);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    const userData = `select * from storeowners where email = '${ownerData.email}' `;
    connection.query(userData, async (err, results) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to add store to the database.",
        });
        return;
      }

      const isEqual = await bcrypt.compare(
        ownerData.password,
        results[0].password_hash,
      );
      if (isEqual) {
        res.send({
          status: "success",
          message: "Login successfully.",
          data: results[0],
        });
      }
    });
  });
});

app.get("/managerBalance", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    const balanceQuery = `
            SELECT 
                m.manager_id,
                m.manager_balance
            FROM 
                manager m
        `;

    connection.query(balanceQuery, (err, results) => {
      connection.release();

      if (err) {
        console.error("Database error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to fetch manager balance from the database.",
        });
        return;
      }

      if (results.length === 0) {
        res.send({ status: "error", message: "Manager not found." });
      } else {
        res.send({ status: "success", balance: results[0] });
      }
    });
  });
});

app.get("/managers", (req, res) => {
  const managerId = req.query.managerId;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    let managerQuery = `
            SELECT 
                s.manager_id,
                COALESCE(SUM(CASE WHEN c.status = 0 THEN c.price ELSE 0 END), 0) AS total_inventory,
                COALESCE(SUM(CASE WHEN c.status = 1 THEN c.price * 0.95 ELSE 0 END), 0) AS total_balance
            FROM 
                storeowners s
            LEFT JOIN 
                computers c ON s.store_id = c.store_id
        `;

    const queryParams = [];
    if (managerId) {
      managerQuery += " WHERE s.manager_id = ?";
      queryParams.push(managerId);
    }

    managerQuery += " GROUP BY s.manager_id";

    connection.query(managerQuery, queryParams, (err, results) => {
      connection.release();

      if (err) {
        console.error("Database error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to fetch manager data from the database.",
        });
        return;
      }

      res.send({ status: "success", totals: results });
    });
  });
});

app.get("/stores", (req, res) => {
  const storeId = req.query.storeId;
  const sortOrder = (req.query.sortOrder || "asc").toLowerCase(); // Default to ascending

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
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
                COALESCE(SUM(CASE WHEN c.status = 0 THEN c.price ELSE 0 END), 0) AS inventory,
                COALESCE(SUM(CASE WHEN c.status = 1 THEN c.price * 0.95 ELSE 0 END), 0) AS balance
            FROM 
                storeowners s
            LEFT JOIN 
                computers c ON s.store_id = c.store_id
        `;
    const queryParams = [];

    let whereClauses = [];
    if (storeId) {
      whereClauses.push("s.store_id = ?");
      queryParams.push(storeId);
    }

    if (whereClauses.length) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " GROUP BY s.store_id";

    // Add ORDER BY clause
    query += " ORDER BY inventory " + (sortOrder === "desc" ? "DESC" : "ASC");

    connection.query(query, queryParams, (err, results) => {
      connection.release();

      if (err) {
        console.error("Database error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to fetch store data from the database.",
        });
        return;
      }
      const stores = results.map((data) => Store.fromDatabase(data));

      res.send({ status: "success", stores: stores });
    });
  });
});

app.post("/create-stores", async (req, res) => {
  const HashedPass = await bcrypt.hash(req.body.password_hash, 12);
  console.log(HashedPass);
  req.body.passwordHash = HashedPass;
  console.log(req.body);
  const storeData = new Store(req.body).toDatabase();

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }
    const query = "INSERT INTO storeowners SET ?";
    connection.query(query, storeData, (err) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to add store to the database.",
        });
        return;
      }
      res.send({ status: "success", message: "Store added successfully." });
    });
  });
});

app.delete("/stores/:store_id", (req, res) => {
  const storeId = req.params.store_id;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }
    const query = "DELETE FROM storeowners WHERE store_id = ?";
    connection.query(query, [storeId], (err) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to delete store from the database.",
        });
        return;
      }
      res.send({ status: "success", message: "Store deleted successfully." });
    });
  });
});

app.get("/computers", (req, res) => {
  const {
    storeId,
    price,
    memory,
    storageSize,
    processors,
    processGenerations,
    graphics,
  } = req.query;
  console.log(req.query);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }
    let query = "SELECT * FROM computers WHERE 1=1 AND status = 0";
    const queryParams = [];

    // Add filters to the query

    if (storeId) {
      query += " AND store_id = ?";
      queryParams.push(storeId);
    }
    if (price) {
      if (price === "$500 or less") {
        query += " AND price <= ?";
        queryParams.push(500);
      } else if (price === "$501 - $1000") {
        query += " AND price BETWEEN ? AND ?";
        queryParams.push(501, 1000);
      } else if (price === "$1,001 - $1,500") {
        query += " AND price BETWEEN ? AND ?";
        queryParams.push(1001, 1500);
      } else if (price === "$1,501 - $2,000") {
        query += " AND price BETWEEN ? AND ?";
        queryParams.push(1501, 2000);
      } else if (price === "$2,001 or more") {
        query += " AND price >= ?";
        queryParams.push(2001);
      }
    }

    if (memory) {
      switch (memory) {
        case "4 GB or less":
          query += " AND memory <= ?";
          queryParams.push(4);
          break;
        case "8 GB":
          query += " AND memory = ?";
          queryParams.push(8);
          break;
        case "12 GB":
          query += " AND memory = ?";
          queryParams.push(12);
          break;
        case "16 GB":
          query += " AND memory = ?";
          queryParams.push(16);
          break;
        case "32 GB or more":
          query += " AND memory >= ?";
          queryParams.push(32);
          break;
      }
    }

    if (storageSize) {
      switch (storageSize) {
        case "256 GB or less":
          query += " AND storage_size <= ?";
          queryParams.push(256);
          break;
        case "512 GB":
          query += " AND storage_size = ?";
          queryParams.push(512);
          break;
        case "1 TB":
          query += " AND storage_size = ?";
          queryParams.push(1024);
          break;
        case "2 TB or more":
          query += " AND storage_size >= ?";
          queryParams.push(2048);
          break;
      }
    }

    if (processors) {
      if (processors === "All Intel Processors") {
        query += " AND processors LIKE ?";
        queryParams.push("%Intel%");
      } else if (processors === "All AMD Processors") {
        query += " AND processors LIKE ?";
        queryParams.push("%AMD%");
      }
    }

    if (processGenerations) {
      query += " AND process_generations = ?";
      queryParams.push(processGenerations);
    }

    if (graphics) {
      if (graphics === "All NVIDIA Graphics") {
        query += " AND graphics LIKE ?";
        queryParams.push("%NVIDIA%");
      } else if (graphics === "All AMD Graphics") {
        query += " AND graphics LIKE ?";
        queryParams.push("%AMD%");
      } else if (graphics === "All Intel Graphics") {
        query += " AND graphics LIKE ?";
        queryParams.push("%Intel%");
      }
    }

    connection.query(query, queryParams, (err, results) => {
      connection.release();

      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to fetch the computer list from the database.",
        });
        return;
      }
      const computers = results.map((data) => Computer.fromDatabase(data));

      const balance =
        0.95 *
        results.reduce(
          (acc, curr) => (curr.status === 1 ? acc + curr.price : acc),
          0,
        );

      const inventory = results.reduce(
        (acc, curr) => (curr.status === 0 ? acc + curr.price : acc),
        0,
      );

      res.send({
        status: "success",
        computers: computers,
        balance: balance,
        inventory: inventory,
      });
    });
  });
});

app.post("/add-computers", (req, res) => {
  const computerData = new Computer(req.body).toDatabase();

  console.log("raw computerData: ", req.body);
  console.log("computerData: ", computerData);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }
    const query = "INSERT INTO computers SET ?";
    connection.query(query, computerData, (err) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to add computer to the database.",
        });
        return;
      }
      res.send({ status: "success", message: "Computer added successfully." });
    });
  });
});

app.put("/update-computer/:computerId", (req, res) => {
  const computerId = req.params.computerId;

  const updateData = new Computer(req.body).toDatabase();

  console.log(updateData);
  //sold computer
  const isStatusUpdatedToOne = updateData.status === 1;

  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([key, value]) => value !== undefined),
  );

  console.log(filteredUpdateData);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    // Check the current status of the computer
    const checkStatusQuery = "SELECT status FROM computers WHERE computer_id = ?";

    connection.query(checkStatusQuery, [computerId], (err, results) => {
      if (err || results.length === 0) {
        connection.release();
        res.status(500).send({ status: "error", message: "Error checking computer status or computer not found." });
        return;
      }

      if (results[0].status === 1) {
        connection.release();
        res.status(409).send({ status: "error", message: "This computer is already sold." });
        return;
      }
    });
    let updateFields = "";
    Object.keys(filteredUpdateData).forEach((key, index) => {
      updateFields += `${key} = ?`;
      if (index < Object.keys(filteredUpdateData).length - 1) {
        updateFields += ", ";
      }
    });

    if (!updateFields) {
      connection.release();
      res.send({ status: "success", message: "No fields to update." });
      return;
    }

    const query = `UPDATE computers SET ${updateFields} WHERE computer_id = ?`;
    const queryValues = [...Object.values(filteredUpdateData), computerId];

    connection.query(query, queryValues, (err, result) => {
      if (err) {
        connection.release();
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to update computer in the database.",
        });
        return;
      }

      if (result.affectedRows === 0) {
        connection.release();
        res.status(404).send({
          status: "error",
          message: "Computer with the given ID not found.",
        });
        return;
      }

      if (isStatusUpdatedToOne) {
        const getPriceQuery = "SELECT price FROM computers WHERE computer_id = ?";

        connection.query(getPriceQuery, [computerId], (err, results) => {
          if (err) {
            connection.release();
            console.error("Failed to retrieve computer price:", err);
            return;
          }
          if (results.length === 0) {
            connection.release();
            console.error("Computer not found.");
            return;
          }

          const price = results[0].price;
          const commission = price * 0.05;

          updateManagerBalance(1, commission, connection);
        });
      } else {
        res.send({
          status: "success",
          message: "Computer updated successfully.",
        });
      }
    });
  });
});

app.delete("/computers/:computerId", (req, res) => {
  const computerId = req.params.computerId;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    updateManagerBalance(1, 25, connection);

    const query = "UPDATE computers SET status = ? WHERE computer_id = ?";
    //set the computer status value = 2
    connection.query(query, [2, computerId], (err, result) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to delete computer from the database.",
        });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send({
          status: "error",
          message: "Computer with the given ID not found.",
        });
        return;
      }

      res.send({
        status: "success",
        message: "Computer deleted successfully.",
      });
    });
  });
});

// Report total inventory in amount in entire site
app.get("/siteInventory", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    const query =
      "SELECT sum(price) as siteInventory FROM computers where status = 1";
    connection.query(query, (err, results) => {
      connection.release();

      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to fetch the computer list from the database.",
        });
        return;
      }

      res.send({
        status: "success",
        siteInventory: results[0]["siteInventory"],
      });
    });
  });
});

// Report total balance in amount in entire site
app.get("/siteBalance", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }

    const query =
      "SELECT sum(price)*0.95 as siteBalance FROM computers where status = 0";
    connection.query(query, (err, results) => {
      connection.release();

      if (err) {
        console.error("Database query error:", err);
        res.status(500).send({
          status: "error",
          message: "Failed to fetch the computer list from the database.",
        });
        return;
      }

      res.send({ status: "success", siteBalance: results[0]["siteBalance"] });
    });
  });
});

function updateManagerBalance(managerId, amount, connection) {
  const updateBalanceQuery =
    "UPDATE manager SET manager_balance = COALESCE(manager_balance, 0) + ? WHERE manager_id = ?";

  // Log the query and its parameters for debugging
  console.log("Executing SQL:", updateBalanceQuery, "Parameters:", [
    amount,
    managerId,
  ]);

  connection.query(updateBalanceQuery, [amount, managerId], (err, result) => {
    if (err) {
      console.error("Failed to update manager balance:", err);
    } else {
      console.log("Update successful:", result);
    }
  });
}

app.post("/test", (req, res) => {
  const body = req.body;
  // Do something with the body
  res.send({ received: true, body: body, test: true, lol: "lol" });
});
app.get("/test_db", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      res.status(500).send({
        status: "error",
        message: "Failed to connect to the database.",
      });
      return;
    }
    connection.query("SELECT 1", (err, results) => {
      connection.release();
      if (err) {
        console.error("Database query error:", err);
        res
          .status(500)
          .send({ status: "error", message: "Failed to query the database." });
        return;
      }
      res.send({
        status: "success",
        message: "Successfully connected to the database.",
      });
    });
  });
});

module.exports.server = serverlessHttp(app);
