/* Overall, localStorage is used to store the current state locally. After each
change, our todo list updates the internal state and reconstructs the webpage based
on this internal state. We store the following state entries:
  username => [saved username for top name field]
  todos => [stringified list of all todos that currently exist, reupdates each
            time a change is made]
*/

window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name'); // selects name field
    const newTodoForm = document.querySelector('#new-todo-form');

    // loads existing username if one exists, otherwise sets it as an empty string
    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    // Listens for changes in the username field
    nameInput.addEventListener('change', (e) => {
        // updates the username stored in localStorage every time it is changed
        localStorage.setItem('username', e.target.value);
    })

    // Listens for when the user hits submit in the todo form
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        // Takes the contents the user has entered and adds it to array of existing todos
        const todo = {
            content: e.target.elements.content.value,
            done: false,
            createdAt: new Date().getTime()
        }

        todos.push(todo);

        // updats local storage
        localStorage.setItem('todos', JSON.stringify(todos));

        // Reset the form
        e.target.reset();

        DisplayTodos()
    })

    DisplayTodos()
})

function DisplayTodos() {
    // Selects our todo list portion, and rebuilds it from scratch every time
    // the function is called
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";

    if (todos.length == 0) {
        todoList.innerHTML = "<h4>You currently have no todos!</h4>"
    }

    //lambda function inside runs over all elements of the todos array
    todos.forEach(todo => {
        // create a <div class="todo-item">
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        // Creates components for an individual todo
        /* Label will be composed of an input functionally determining whether the
           entry is complete along with a <span> element to draw a bubble and show
           completion information */
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');

        // Content element will house the actual todo contents
        const content = document.createElement('div');

        // Action div will house the edit and delete buttons
        const actions = document.createElement('div');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox'; // can be toggled on/off more easily
        input.checked = todo.done;
        span.classList.add('bubble'); // we've done the CSS to illustrate this

        content.classList.add('todo-content');
        actions.classList.add('actions');
        editButton.classList.add('edit');
        deleteButton.classList.add('delete');

        // Structures text shown as an input field so that it can be edited if necessary
        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        editButton.innerHTML = 'Edit'; // sets the text inside the button
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        /* The element tree: 
            todoList will house all the todoItems
            Each todoItem consists of the label, content, and actions in that
            order
              label houses the items that show whether the entry has been
              completed, and allows the user to toggle this property
                Under label, input is used for checkbox functionality, and span
                is used for visual purposes
              content contains the text entry of the todo element itself
              actions houses the edit and delete buttons which allow the user to
              edit the content text, or delete the todo
                Under actions, editButton and deleteButton are self-explanatory
        */

        if (todo.done) {
            todoItem.classList.add('done'); // adds the done class to done todos
        }

        // adds a listener to label > input that updates if a todo is marked as done
        input.addEventListener('change', (e) => {
            // we get todo completion status from whether the checkbox is checked
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            // toggles between containing the done class for a given todo entry
            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos()

        })

        // Adds a listener for editButton which toggles editing mode
        editButton.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            // Removing readonly allows the user to change the internal text
            input.removeAttribute('readonly');
            input.focus();
            /* Listening for blur (i.e. the user is no longer editing, focus has
                shifted to another element) allows us to re-add the readonly property
                once the user is done */
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                // updates new contents in local storage
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos()

            })
        })

        /* Adds a listener for deleteButton that deletes the current todo from 
           our internal state. This is updated visually once DisplayTodos() rebuilds
           the list of existing todos */
        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos()
        })

    })
}