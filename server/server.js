require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const studentRoutes = require('./routes/students')

const app = express();

// Logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Parse JSON requests
app.use(express.json());

// Set up routes
app.use('/api/students', studentRoutes);

// Error handling middleware (this should be the LAST middleware before you connect to DB and listen on a port)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!')
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!')
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log('listening for requests on port', PORT)
        })
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app