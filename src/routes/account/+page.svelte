<script lang="ts">
	// @ts-ignore
	import Flex from 'svelte-flex';
	import Textfield from '@smui/textfield';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import Card, { Content } from '@smui/card';
	import Paper from '@smui/paper';

	let labelWidth = 4;
	let textboxWidth = 8;

	let email = '';
	let password = '';
	let pocketbase = '';

	function saveData() {}

	function clearForm() {
		email = '';
		password = '';
		pocketbase = '';
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
		<Paper>
			<LayoutGrid>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Email:</p>
				</Cell>
				<Cell span={textboxWidth}>
					<Textfield variant="outlined" bind:value={email} label="email" style="width: 100%;">
						<HelperText slot="helper">example@gmail.com</HelperText>
					</Textfield>
				</Cell>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Password:</p>
				</Cell>
				<Cell span={textboxWidth}>
					<Textfield variant="outlined" bind:value={password} label="password" style="width: 100%;">
						<HelperText slot="helper">amazing_password</HelperText>
					</Textfield>
				</Cell>
				<Cell span={labelWidth} style="text-align: right;">
					<p>PocketBase:</p>
				</Cell>
				<Cell span={textboxWidth}>
					<Textfield variant="outlined" bind:value={pocketbase} label="URI" style="width: 100%;">
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
</div>
