<script lang="ts">
    import { page } from '$app/stores';
	import Flex from 'svelte-flex';
	const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<Flex>
	<h1>Error</h1>
</Flex>
<Flex>
	<h3>{$page.status}: {$page.error?.message}</h3>
</Flex>


<style>
	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 2rem 0 0.5em 0;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>