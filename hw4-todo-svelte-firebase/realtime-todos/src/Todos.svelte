<script>
    import TodoItem from "./TodoItem.svelte";
    import { db } from "./firebase";
    import { collectionData } from "rxfire/firestore";
    import { startWith } from "rxjs/operators";
    import {
        doc,
        setDoc,
        collection,
        query,
        where,
        orderBy,
        addDoc,
        deleteDoc,
        updateDoc,
        getDocs,
    } from "firebase/firestore";

    // User ID passed from parent
    export let uid;

    // Form Text
    // We deviate from the tutorial here -- we remove the contents of text
    // The user input text field is binded to text by default, and since I've
    // added a placeholder below, this is a better design choice.
    let text = "";

    // Query requires an index, see screenshot below
    const q = query(
        collection(db, "todos"),
        where("uid", "==", uid),
        orderBy("created")
    );

    // Set up an observable that returns the documents from the selected collection/query.
    // we use idField: "id" to also have the id for each document.
    const todos = collectionData(q, { idField: "id" }).pipe(startWith([]));

    async function add() {
        // Adds a new document to our database
        await addDoc(collection(db, "todos"), {
            uid,
            text,
            complete: false,
            created: Date.now(),
        });
        text = "";
    }

    async function updateStatus(event) {
        // takes the id of the todo being interacted with, and then updates the completion status (aka toggling true/false)
        const { id, newStatus } = event.detail;
        await updateDoc(doc(db, "todos", id), {
            complete: newStatus,
        });
    }

    async function removeItem(event) {
        // Takes the id of the current todo's document, and delets it from our store
        const { id } = event.detail;
        await deleteDoc(doc(db, "todos", id));
    }
</script>

<ul>
    {#each $todos as todo}
        <TodoItem {...todo} on:remove={removeItem} on:toggle={updateStatus} />
    {/each}
</ul>

<input
    style="min-width: 500px"
    placeholder="Type your new to-do here. Press Add Task/Enter to add."
    bind:value={text}
/>

<button on:click={add}>Add Task</button>
<!-- Window listener for enter key below -->
<svelte:window
    on:keypress={(event) => {
        console.log(event);
        if (event.key === "Enter") {
            add();
        }
    }}
/>

<style>
    input {
        display: block;
    }
</style>
