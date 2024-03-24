require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const studentRoutes = require('./routes/students')
const mentorRoutes = require('./routes/mentors')
const FacultyMemberRoutes = require('./routes/facultyMember')


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
app.use('/api/user', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/facultyMember', FacultyMemberRoutes);


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

// else {
//     // Connect to MongoDB and start server
//     mongoose.connect(process.env.MONGO_URI)
//         .then(() => {
//             console.log('connected to database')
//             app.listen(PORT, () => {
//                 console.log('listening for requests on port', PORT)
//             })
//         })
//         .catch((error) => {
//             console.log(error);
//         })
// }

module.exports = app