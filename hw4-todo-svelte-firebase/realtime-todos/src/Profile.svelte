<script>
    export let displayName;
    export let photoURL;
    export let uid;
    // console.log($$props); // used this for testing purposes.
    // TIL in svelte we can access component props using $$props.
    // We use this component to show the user's profile.
</script>

<h3>Hi {displayName}!</h3>

<img src={photoURL} width="100" alt="user avatar" />
<p>Your userID is {uid}</p>
