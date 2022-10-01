<script>
	import Profile from "./Profile.svelte";
	import Todos from "./Todos.svelte";

	import { auth, googleProvider } from "./firebase";
	import { signInWithPopup, signOut } from "firebase/auth";
	import { authState } from "rxfire/auth";

	let user;

	// Set the user variable which we'll be passing on to other components
	const unsubscribe = authState(auth).subscribe((u) => (user = u));

	function login() {
		signInWithPopup(auth, googleProvider);
	}
</script>

<section>
	{#if user}
		<Profile {...user} />
		<button on:click={() => signOut(auth)}>Logout</button>
		<hr />
		<Todos uid={user.uid} />
	{:else}
		<button on:click={login}> Signin with Google </button>
	{/if}
</section>
