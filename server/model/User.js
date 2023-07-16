const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    category: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
},{
    collection: "connectx-users"
})

const model = mongoose.model("UserData", User);
module.exports = model;