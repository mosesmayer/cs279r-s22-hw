<script>
    import { TasksCollection } from "../db/TasksCollection";

    export let task;

    const toggleChecked = () => {
        // Set the isChecked property to the opposite of its current value
        // Originally we interacted directly with TaskCollection, which is not secure.
        // We use Meteor.call to communicate with the server and use Optimistic UI.
        Meteor.call("tasks.setIsChecked", task._id, !task.isChecked);
    };

    // calls the tasks.remove task as defined in our methods
    const deleteThisTask = () => Meteor.call("tasks.remove", task._id);
</script>

<li>
    <input
        type="checkbox"
        readonly
        checked={!!task.isChecked}
        on:click={toggleChecked}
    />
    <span>{task.text}</span>
    <button class="delete" on:click={deleteThisTask}>&times;</button>
</li>
