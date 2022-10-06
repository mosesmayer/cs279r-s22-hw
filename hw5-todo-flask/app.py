from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# from tutorial: /// -> rel path, //// -> abs path
# we're using sqlalchemy as a database management tool
# translates python classes to tables and functions to sql calls
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    # Here we add the columns to our database model
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    complete = db.Column(db.Boolean)
    editing = db.Column(db.Boolean)  # toggle whether currently editing or not

# Flask uses @app.route before functions to route to different pages

# We enable both get and post requests by setting the methods. By default a
# given route handles get requests


@app.route('/', methods=["GET", "POST"])
def home():
    # pass in all entries in database to be rendered in template
    todo_list = Todo.query.all()
    # we render the base.html template file -- see /templates/base.html for the
    # raw html code
    return render_template("base.html", todo_list=todo_list)


@app.route("/add", methods=["POST"])
def add():
    """Handles new todo additions"""
    title = request.form.get("title")
    new_todo = Todo(title=title, complete=False, editing=False)
    db.session.add(new_todo)
    db.session.commit()  # commit changes to the database
    # after we call the operations/changes we reroute back to the home page
    return redirect(url_for("home"))


@app.route("/update/<int:todo_id>")
def update(todo_id):
    """Handles toggling a todo's completion status"""
    # Selects the particular todo referring to our todo_id
    todo = Todo.query.filter_by(id=todo_id).first()
    todo.complete = not todo.complete
    db.session.commit()
    return redirect(url_for("home"))


@app.route("/delete/<int:todo_id>")
def delete(todo_id):
    """Handles deleting a todo from the list"""
    todo = Todo.query.filter_by(id=todo_id).first()
    db.session.delete(todo)
    db.session.commit()
    return redirect(url_for("home"))


@app.route("/edit/<int:todo_id>", methods=['GET', 'POST'])
def edit(todo_id):
    """Handles edits for a given todo"""
    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo.editing:
        # toggle editing on
        todo.editing = True
    else:
        if (request.method == 'POST'):
            # our form submits a post request
            new_todo_title = request.form.get('todoTitle')
            print(new_todo_title)
            todo.title = new_todo_title
        todo.editing = False
    db.session.commit()
    return redirect(url_for("home"))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # initializes database
    app.run(debug=True)
