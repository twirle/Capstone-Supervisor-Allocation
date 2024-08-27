# Capstone Supervisor Allocation Application - Capstone Connect

Web application built on MERN stack (MongoDB, Express.js, React, and Node.js) designed to facilitate the allocation of capstone students to supervisors based on their job scopes and the supervisors' research areas. The application uses tokenisation to and then matching algorithms to identify the various possible alignment between students' interests and supervisors' expertise, with consideration to supervisors' mentoring capacity as well.

Live client can be accessed on [Vercel](https://client-indol-mu.vercel.app).

## Features

- Student and Supervisor User accounts and profiles: allows the creation and management of student and supervisor users, as well as relevant details such as their courses, faculty, job scopes, research areas, etc.
- Automated matching: Tokenises students' input job scope text before algorithms match against supervisors' research areas for a good fit.
- Admin User Management and Matching dashboard: Provides admin user interface to manage users, view allocations and results.
- Importing of student/supervisor data from CSV files into MongoDB
- Test setup with Mocha and Chai.

## Matching Details

- Scores are given to each Student-Supervisor pair using the Jaccard algorithm
- Greedy, Gale-Shapley and Hungarian algorithms to provide matches using scores provided, and tested with sets of different sizes. (10 - 100, 30 - 300, 100-300)

## Stack

- **MongoDB**: Database to store user accounts, profiles, job scopes, and research areas. Using the basic free plan
- **Express.js**: Web framework for building RESTful APIs.
- **React**: Frontend library for building the user interface.
- **Node.js**: Backend runtime environment for executing JavaScript code.

## Installation

1. To install the necessary packages for this project, run this command in both the root directory in the `server` (for backend) and the `client` directory (for frontend):

```
npm install
```

2. Start client and server:

```
client: npm start
server: node index.js
```
