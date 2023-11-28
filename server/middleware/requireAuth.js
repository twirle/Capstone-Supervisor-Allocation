const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    // to verify user authentication
    const { authorisation } = req.headers()

    if (!authorisation) {
        return res.status(401).json({ error: 'Authorisation token required.' })
    }

    // split token string to get the token
    const token = authorisation.split(' ')[1]

    // grab id from token to verify using jsonwebtoken
    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        // grab _id from token if verification was success
        req.user = await User.findOne({ _id }).select('_id')
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Request is not authorised.' })
    }
}

module.exports = requireAuth