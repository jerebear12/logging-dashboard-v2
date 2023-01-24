<script lang="ts">
	const navigation: string[] = ['Account', 'Settings', 'About'];
</script>

<nav id="nav">
	<ul>
		<li id="logo">
			<a href="/"> Seaweed Dashboard </a>
		</li>
		{#each navigation as nav}
			<li class="nav-container">
				<a href="/{nav.toLowerCase()}">{nav}</a>
			</li>
		{/each}
	</ul>
</nav>

<slot />

<style>
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	li {
		float: right;
		margin: 0.5em 2rem 1rem 0;
		font-weight: 500;
		font-size: 1.2em;
	}
	li a {
		display: block;
		padding: 8px;
		text-decoration: none;
		height: 100%;
		color: white;
	}
	#logo {
		float: left;
		font-size: 2em;
		margin-left: 2rem;
	}
	.nav-container {
		margin-top: 1.3em;
	}
</style>
