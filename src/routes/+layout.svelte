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

<div class="content">
	<slot />
</div>

<footer id="footer">
	<div>
		<p>Logging Dashboard and extlog are closed source tools written to interface with SeaweedFS. SeaweedFS has Filers which output logs to a single file; useful for small environments but hard to manage when scale is introduced. Logging Dashboard and extlog were developed to bring all the Filer's logs to one place where they can be examined and queried. Need help? <a href="mailto: jeremiahgavin12@gmail.com">email me</a></p>
	</div>
</footer>

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
	#footer {
		display: flex;
		align-content: center;
		position: absolute;
		bottom: 0;
		height: 160px;
	}
	footer div {
		border: 1px solid rgb(92, 92, 92);
		border-radius: 0.2rem;
		padding: 1em;
		margin: 0.5rem 1%;
	}
	.content {
		padding-bottom: 160px;
	}
</style>
