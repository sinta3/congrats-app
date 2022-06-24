const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    date: { type: String },
    isSent: { type: Boolean, default: false },
    time_send: { type: String },
    congrats_type: { type: String },
    timezone: { type: String }
})

const User = mongoose.model('User', userSchema)
module.exports = User
