require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const studentRoutes = require('./routes/student')
const mentorRoutes = require('./routes/mentor')
const facultyMemberRoutes = require('./routes/facultyMember')
const facultyRoutes = require('./routes/faculty')
const matchRoutes = require('./routes/match')

const app = express();

// Parse JSON requests
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// Routes
// app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/mentor', mentorRoutes)
app.use('/api/facultyMember', facultyMemberRoutes)
app.use('/api/faculty', facultyRoutes)
app.use('/api/match', matchRoutes)


// Error handling middleware (this should be the LAST middleware before you connect to DB and listen on a port)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!')
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!')
})

// Only connect to DB and listen on port if NOT in test environment
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`Server listening on port ${process.env.PORT}`);
            });
        })
        .catch((error) => {
            console.error('Connection error:', error);
        });
}

module.exports = app