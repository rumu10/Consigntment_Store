const express = require('express');
const serverlessHttp = require('serverless-http');

const app = express();

app.use(express.json());

app.post('/endpoint', (req, res) => {
    const body = req.body;
    // Do something with the body
    res.send({ received: true, body: body });
});

app.post('/test', (req, res) => {
    const body = req.body;
    // Do something with the body
    res.send({ received: true, body: body, test: true,lol:"lol" });
});

module.exports.server = serverlessHttp(app);

