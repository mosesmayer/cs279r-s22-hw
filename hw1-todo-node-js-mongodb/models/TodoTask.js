const mongoose = require("mongoose");

// can think of schemas as a skeleton data structure/object template.
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('TodoTask', todoTaskSchema);