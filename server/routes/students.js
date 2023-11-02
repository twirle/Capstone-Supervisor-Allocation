const express = require("express")

// const Student = require("../models/studentModel")
const {
  getStudents,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent
} = require('../controllers/studentController')

const router = express.Router();

// GET all workouts
router.get('/', getStudents)

// GET a single workout
router.get('/:id', getStudent)

// POST a new workout
router.post('/', createStudent)

// DELETE a workout
router.delete('/:id', deleteStudent)

// UPDATE a workout
router.patch('/:id', updateStudent)

module.exports = router