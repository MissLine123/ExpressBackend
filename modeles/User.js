const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admim: {type: Boolean},
});
module.exports.User = mongoose.model('User', userSchema);