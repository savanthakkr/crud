const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path')


//environment
const dotenv = require('dotenv');
const mysqlpool = require('./config/db');
dotenv.config();

const PORT = process.env.PORT || 3000;


//middleware
app.use(morgan('dev'))
app.use(express.json());


//route
app.use('/api/getAllUsers', require('./routes/userRoutes'));
app.use('/api/get/:id', require('./routes/userRoutes'));




app.get('/test', (req, res) => {
    res.status(200).send('hello world');
})

mysqlpool.query('SELECT 1 + 1 AS solution')
    .then(() => {
        console.log('database connected')

        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`)
        });
    })
    .catch((err) => {
        console.log(err);
    });