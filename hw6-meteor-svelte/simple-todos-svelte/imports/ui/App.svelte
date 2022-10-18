<script>
  // same as svelte in previous HWs
  import { TasksCollection } from "../db/TasksCollection";
  import { Meteor } from "meteor/meteor";
  import Task from "./Task.svelte";
  import TaskForm from "./TaskForm.svelte";
  import LoginForm from "./LoginForm.svelte";

  let hideCompleted = false;

  const hideCompletedFilter = { isChecked: { $ne: true } };

  let incompleteCount;
  let pendingTasksTitle = "";
  let tasks = [];
  let user = null;

  let isLoading = true;
  // subscribe to tasks; allows client to ask for data
  const handler = Meteor.subscribe("tasks");

  $m: {
    user = Meteor.user();

    if (user) {
      isLoading = !handler.ready();

      const userFilter = { userId: user._id };
      const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

      // sort based on createdAt entry and don't take completed ones if hideCompleted is true
      tasks = TasksCollection.find(
        hideCompleted ? pendingOnlyFilter : userFilter,
        { sort: { createdAt: -1 } }
      ).fetch();

      incompleteCount = TasksCollection.find(pendingOnlyFilter).count();

      pendingTasksTitle = `${incompleteCount ? ` (${incompleteCount})` : ""}`;
    }
  }
  // $m creates tracker statements that are reactive and will update
  // we have access to this from zodern:melte Svelte compiler

  const setHideCompleted = (value) => {
    hideCompleted = value;
  };

  const logout = () => Meteor.logout();
</script>

<div class="app">
  <header>
    <div class="app-bar">
      <div class="app-header">
        <h1>📝️ To Do List {pendingTasksTitle}</h1>
      </div>
    </div>
  </header>

  <div class="main">
    {#if user}
      <div class="user" on:click={logout}>
        {user.username} 🚪
      </div>
      <TaskForm />

      <div class="filter">
        <!-- Toggles hideCompleted boolean var above -->
        <button on:click={() => setHideCompleted(!hideCompleted)}>
          {hideCompleted ? "Show All" : "Hide Completed"}
        </button>
      </div>

      {#if isLoading}
        <div class="loading">loading...</div>
      {/if}

      <ul class="tasks">
        {#each tasks as task (task._id)}
          <Task {task} />
        {/each}
      </ul>
    {:else}
      <LoginForm />
    {/if}
  </div>
</div>
