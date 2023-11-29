require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const adminRoutes = require('./routes/admin')
const studentRoutes = require('./routes/students')
const userRoutes = require('./routes/user')


const app = express();

// Parse JSON requests
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/user', userRoutes);

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
        const PORT = process.env.PORT
        app.listen(PORT, () => {
            console.log('listening for requests on port', PORT)
        })
    })
    .catch((error) => {
        console.log(error);
    })

module.exports = app