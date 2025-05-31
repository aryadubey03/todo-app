const mongoose = require('mongoose');

const todoschema = new mongoose.Schema(
    {
        listname: { type: String, required: true },
        task: { type: String, required: false },
        completed: { type: Boolean, required: false }
    }
);

const Todo = mongoose.model('Todo', todoschema);

module.exports = Todo;