const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const deleteUserRelatedData = require('../middleware/cascadeDelete')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'mentor', 'student', 'facultyMember'],
        required: true
    }
})

// status signup
userSchema.statics.signUp = async function (email, password, role) {

    // validation
    if (!email || !password) { throw Error('All fields must be filled.') }

    if (!validator.isEmail(email)) { throw Error('Email is not valid.') }

    if (!validator.isStrongPassword(password)) { throw Error('Password is not strong.') }

    const exists = await this.findOne({ email })
    if (exists) { throw Error('Email already in use.') }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash, role })
    return user
}

// static login
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled.')
    }

    const user = await this.findOne({ email })
    if (!user) { throw Error('Incorrect email.') }

    const match = await bcrypt.compare(password, user.password)
    if (!match) { throw Error('Incorrect password.') }

    return user
}

// Remove user information when user is deleted using middleware cascadeDelete.js
userSchema.pre('remove', async function (next) {
    await deleteUserRelatedData(this._id)
    next()
})

module.exports = mongoose.model('User', userSchema)