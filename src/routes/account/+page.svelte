<script lang="ts">
	// @ts-ignore
	import Flex from 'svelte-flex';
	import Textfield from '@smui/textfield';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import Card, { Content } from '@smui/card';
	import Paper from '@smui/paper';
	import { pb, user, loggedIn } from '../../stores/state';
	import { onMount } from 'svelte';
	import type { Client } from '../../types/Client';
	import type { User } from '../../types/User';
	import Snackbar, { Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';

	let labelWidth = 4;
	let textboxWidth = 8;

	let snackbarError: Snackbar;
	let errorMsg = 'Sorry, that didn\'t work, please try again!';

	let usr: User = {
		email: '',
		password: ''
	}

	let client: Client = {
		URL: ''
	}

	onMount(() => {
		getUser();
		getClient();
	})

	function getUser() {
		try {
			let stringObject = localStorage.getItem('user');
			if (stringObject) {
				usr = <User>JSON.parse(stringObject);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function getClient() {
		try {
			let stringObject = localStorage.getItem('client');
			if (stringObject) {
				client = <Client>JSON.parse(stringObject);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function setUser() {
		localStorage.setItem('user', JSON.stringify(usr));
	}

	function setClientURL() {
		localStorage.setItem('client', JSON.stringify(client));
	}

	function saveData() {
		// pb password must be at least 8 chars, URI should be greater than 6 chars, and shortest possible email length is 3 chars
		if (usr.email.length > 3 && usr.password.length > 7 && client.URL.length > 6) {
			user.setEmail(usr.email);
			user.setPassword(usr.password);
			pb.setURL(client.URL);

			setUser();
			setClientURL();
		} else {
			// display error
			errorMsg = 'Cannot save. Fill each form please.';
			snackbarError.forceOpen();
		}
	}

	function clearForm() {
		usr.email = '';
		usr.password = '';
		client.URL = '';
	}
</script>

<div>
	<Flex style="margin: 2rem auto">
		<h1>Account</h1>
	</Flex>
	<Flex style="margin-bottom: 2rem">
		<Card variant="outlined">
			<Content>Add PocketBase database Admin credentials here.</Content>
		</Card>
	</Flex>
	<Flex>
		<Paper color="primary" variant="outlined" style="min-width: 450px">
			<LayoutGrid>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Email:</p>
				</Cell>
				<Cell span={textboxWidth}>
					<Textfield variant="outlined" bind:value={usr.email} label="email" style="width: 100%;">
						<HelperText slot="helper">example@gmail.com</HelperText>
					</Textfield>
				</Cell>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Password:</p>
				</Cell>
				<Cell span={textboxWidth}>
					<Textfield variant="outlined" bind:value={usr.password} label="password" style="width: 100%;">
						<HelperText slot="helper">amazing_password</HelperText>
					</Textfield>
				</Cell>
				<Cell span={labelWidth} style="text-align: right;">
					<p>PocketBase:</p>
				</Cell>
				<Cell span={textboxWidth}>
					<Textfield variant="outlined" bind:value={client.URL} label="URI" style="width: 100%;">
						<HelperText slot="helper">http://localhost:8090</HelperText>
					</Textfield>
				</Cell>
			</LayoutGrid>
			<Flex>
				<Button on:click={() => clearForm()} variant="outlined" style="width: 120px">
					<Label>Clear</Label>
				</Button>
				<Button on:click={() => saveData()} variant="raised" style="margin-left: 2em; width: 120px">
					<Label>Save</Label>
				</Button>
			</Flex>
		</Paper>
	</Flex>
	<Snackbar bind:this={snackbarError} class="snackbar-error">
		<Label
		  >{errorMsg}</Label
		>
		<Actions>
		  <IconButton class="material-icons" title="Dismiss">close</IconButton>
		</Actions>
	</Snackbar>
</div>
