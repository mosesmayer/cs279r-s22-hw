<script>
    import { TasksCollection } from "../db/TasksCollection";

    let newTask = "";

    const handleSubmit = () => {
        if (!newTask) return;

        // Insert a task into the collection
        Meteor.call("tasks.insert", newTask);

        // Clear form
        newTask = "";
    };
</script>

<!-- |preventDefault calls event.preventDefault(), which means that if the event (here submit) is not explicitly handled it should be ignored -->
<form class="task-form" on:submit|preventDefault={handleSubmit}>
    <!-- Form to add new tasks; value is binded to `newTask` as defined above -->
    <input
        type="text"
        name="text"
        placeholder="Type to add new tasks"
        bind:value={newTask}
    />
    <button type="submit">Add Task</button>
</form>
