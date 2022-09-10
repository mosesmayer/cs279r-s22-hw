// Express app -- lets us use HTTP request/response objects + dynamic page rendering
const express = require("express");
const app = express();

// Using dotenv to load environment vars from a .env file
const dotenv = require("dotenv");

// mongoose is the main way in which we're interfacing with MongoDB
// as an object data modeling (ODM) library, it helps manage our objects
// and representations between our code and in MongoDB, along with schema
// validation
const mongoose = require("mongoose");

// models -- higher-order constructors, takes in schema and creates instance
const TodoTask = require("./models/TodoTask");

dotenv.config();

// Based on file/folder naming, this lets us access the stylesheet
app.use("/static", express.static("public"));

// For POST -- parses using qs library, which lets us parse nested objects in
// the POST query
app.use(express.urlencoded({ extended: true }));

// line is deprecated for newer versions of mongoose, hence commented out 
// mongoose.set("useFindAndModify", false);

// Connect to mongoDB using environment variable defined in .env
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    app.listen(3000, () => console.log("Server Up and running"));
})

// using embedded JS to dynamically load in views
app.set("view engine", "ejs");

// We'll be setting up CRUD below using get and post

// (R)ead -- renders our ejs frontend with information from the database
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        // Passing the tasks received as todoTasks, which we'll use in the ejs
        res.render('todo.ejs', { todoTasks: tasks });
    });
});

// (C)reate
app.post('/', async (req, res) => {
    // console.log(req.body); // just for debugging purposes, hence commented out
    const todoTask = new TodoTask({
        // construct a new object with the request content,
        // which we extract from the form (todo-header)
        content: req.body.content
    });

    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

//UPDATE
app
    .route("/edit/:id") // routes to interact with edit elements (links in ejs)
    .get((req, res) => {
        // checks the id of the selected todo and ensures to toggle editing
        // for just that id
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            // updates using todoEdit.ejs, which dynamically loads the selected
            // element as a form to be editable
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        // once we're done editing, try to send an update for the selected
        // todo element
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });


//DELETE
app.route("/remove/:id").get((req, res) => { // routes with the id of the chosen todo
    const id = req.params.id;
    // find by selected id above and remove
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});


// Note that there is a slight issue with the tutorial design:
// if the user is currently in edit mode, and tries to add a new todo,
// it will overwrite the currently edited todo. Practically speaking this
// shouldn't be too much of an issue because it would still 'change' the
// existing todo, but there is the debate that this should not be a
// permitted operation