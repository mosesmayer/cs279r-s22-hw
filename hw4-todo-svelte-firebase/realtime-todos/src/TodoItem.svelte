<script>
    import { createEventDispatcher } from "svelte";

    // helps dispatch events that we can capture
    const dispatch = createEventDispatcher();

    function remove() {
        dispatch("remove", { id });
    }

    function toggleStatus() {
        let newStatus = !complete;
        dispatch("toggle", {
            id,
            newStatus,
        });
    }

    // console.log("Todo", $$props);
    export let id; // document ID
    export let text; // todo text contents
    export let complete; // status on completion
</script>

<li>
    {#if complete}
        <span class="is-complete">{text}</span>
        <button on:click={toggleStatus}>
            <span style="color:green">✔️</span>
        </button>
    {:else}
        <span>{text}</span>
        <button on:click={toggleStatus}> ❌ </button>
    {/if}

    <button on:click={remove}> 🗑 </button>
</li>

<style>
    .is-complete {
        text-decoration: line-through;
        color: green;
    }
</style>
