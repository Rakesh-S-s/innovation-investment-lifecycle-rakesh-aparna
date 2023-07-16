const mongoose = require("mongoose")

const Ideas = new mongoose.Schema({
    createdBy: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
},{
    collection: "connectx-data"
})

const model = mongoose.model("UserIdeas", Ideas);
module.exports = model;