const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');

const app = express();

const MONGODB_URI = 'mongodb://127.0.0.1:27017/tasks?';
const PORT = process.env.PORT || 8080;


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*', '*://localhost:*/*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, method'); //Authorization must be enabled on front-end
    next();
});

app.use(bodyParser.json());

app.use(taskRoutes);

app.get('/',(req, res, next) => {
    res.status(200).send(`
        <h1>Welcome to server</h1>
    `);
});

mongoose
.connect(MONGODB_URI)
.then(result=>{
    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
})
.catch(err=>{
    console.error("Error connecting to database", err);
})


app.listen(3000);