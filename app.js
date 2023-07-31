const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');

const app = express();

const MONGODB_URI = 'mongodb://127.0.0.1:27017/tasks?';
// const MONGODB_URI = 'mongodb+srv://Halby:root@cluster0.bs6du.mongodb.net/tasks?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*', '*://localhost:*/*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, method'); //Authorization must be enabled on front-end
    next();
});

app.use(bodyParser.json());

app.use(taskRoutes);

app.get('/', (req, res, next) => {
    res.status(200).send(`
        <h1>Welcome to server</h1>
    `);
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data
    });
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    })
    .catch(err => {
        console.error("Error connecting to database", err);
    })