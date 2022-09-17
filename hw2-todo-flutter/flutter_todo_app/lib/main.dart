import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'; // used for debug prints

class Todo {
  Todo({required this.name, required this.checked});
  final DateTime dateCreated = DateTime.now();
  String name;
  bool checked; // not final as we want to be able to modify this later on
}

void main() => runApp(
      new TodoApp(),
    );

class TodoApp extends StatelessWidget {
  // Flutter is laid out in widgets.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Todo list',
      home:
          new TodoList(), // returns TodoList, a widget which will contain the actual list and control todo item state
    );
  }
}

class TodoList extends StatefulWidget {
  // We use a StatefulWidget here as we want our todo list to interact with a state
  @override
  _TodoListState createState() => new _TodoListState();
}

class _TodoListState extends State<TodoList> {
  // extends state of the TodoList widget
  // define some variables
  final TextEditingController _textFieldController = TextEditingController();
  final List<Todo> _todos = <Todo>[];

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        // add AppBar that will hold a title
        title: new Text('Todo list'),
      ),
      body: ListView(
        // define body section, here we use a ListView with todos as children
        padding: EdgeInsets.symmetric(vertical: 8.0),
        children: _todos.map((Todo todo) {
          return TodoItem(
            todo: todo,
            onTodoChanged: _handleTodoChange, // change handler
            onTodoEdited: _handleTodoEdit, // add edit/delete handler
          );
        }).toList(),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _displayDialog(),
        tooltip: 'Add Item',
        child: Icon(Icons.add),
      ),
    );
  }

  // Other functions here
  Future<void> _displayDialog() async {
    // Future: potential value e.g. text string after it is typed by the user
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Add a new todo item'),
          content: TextField(
            controller: _textFieldController,
            decoration: const InputDecoration(hintText: 'Type your new todo'),
          ),
          actions: <Widget>[
            TextButton(
              // when button is pressed, add new todo and close off dialog
              child: const Text('Add'),
              onPressed: () {
                if (_textFieldController.text == "") {
                  // do nothing if empty
                } else {
                  Navigator.of(context).pop();
                  _addTodoItem(_textFieldController.text);
                }
              },
            ),
          ],
        );
      },
    );
  }

  void _addTodoItem(String name) {
    setState(() {
      _todos.add(Todo(name: name, checked: false));
    });
    _textFieldController.clear(); // adds new todo, clears text entry field
  }

  void _handleTodoChange(Todo todo) {
    setState(() {
      // updates state of that todo
      todo.checked = !todo.checked;
      // debugPrint('Date created: ${todo.dateCreated}, Contents: ${todo.name}');
    });
  }

  void _handleTodoEdit(Todo todo) {
    // When the user long presses/holds down, create a dialog that lets them edit and save
    // or delete the todo entirely.

    // load current todo entry onto the text field controller
    _textFieldController.text = todo.name;
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Edit todo item'),
          content: TextField(
            controller: _textFieldController,
            decoration: const InputDecoration(hintText: 'Type your new todo'),
          ),
          actions: <Widget>[
            TextButton(
              // when button is pressed, add new todo and close off dialog
              child: const Text('Save'),
              onPressed: () {
                if (_textFieldController.text == "") {
                  // do nothing if empty
                } else {
                  Navigator.of(context).pop();
                  setState(() {
                    todo.name = _textFieldController.text;
                  });
                  _textFieldController.clear();
                }
              },
            ),
            TextButton(
                onPressed: () {
                  // erases todo from our list
                  Navigator.of(context).pop();
                  setState(() {
                    // we can ensure things are unique due to creation time
                    _todos.remove(todo);
                  });
                  _textFieldController.clear();
                },
                // change color of delete button to red to make it more prominent
                style: TextButton.styleFrom(primary: Colors.redAccent),
                child: const Text('Delete')),
          ],
        );
      },
    );
  }
}

class TodoItem extends StatelessWidget {
  TodoItem({
    required this.todo,
    required this.onTodoChanged,
    required this.onTodoEdited,
  }) : super(key: ObjectKey(todo)); // pass on todo and change handler

  final Todo todo;
  final onTodoChanged;
  final onTodoEdited;

  TextStyle? _getTextStyle(bool checked) {
    if (!checked) return null;

    return TextStyle(
      color: Colors.black54,
      decoration: TextDecoration.lineThrough,
    ); // if checked, return strikethrough style
  }

  @override
  Widget build(BuildContext context) {
    // make actual widget that is displayed
    // this goes in our ListView as the todo list is a ListView
    return ListTile(
      onTap: () {
        onTodoChanged(todo);
      },
      leading: CircleAvatar(
        child: Icon(Icons.keyboard_arrow_right),
        // ^^ changed to nice icon from first letter as in tutorial
      ),
      title: Text(
        todo.name,
        style: _getTextStyle(todo.checked),
      ),
      onLongPress: () {
        onTodoEdited(todo);
        debugPrint("Long press detected");
      },
      trailing: Text('Hold to edit/delete'),
    );
  }
}
