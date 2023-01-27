<script lang="ts">
	// @ts-ignore
	import Flex from 'svelte-flex';
	import Paper from '@smui/paper';
	import Textfield from '@smui/textfield';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import HelperText from '@smui/textfield/helper-text';
	import Card, { Content } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import type { Logger } from '../../types/Logger';
	import { loggers } from '../../stores/state';
	import { onMount } from 'svelte';
	import Snackbar, { Actions } from '@smui/snackbar';

	let labelNameWidth = 1;
	let labelURLWidth = 1;
	let nameWidth = 4;
	let urlWidth = 6;

	let snackbarSuccess: Snackbar;
	let successMsg = 'Awesome! That worked.';

	let lgrs: Logger[] = [
		{
			name: 'All',
			url: ''
		}
	];

	$: lgrs = lgrs;

	function clearAll() {
		lgrs = [
			{
				name: 'All',
				url: ''
			}
		];
	}

	function saveData() {
		localStorage.setItem('loggers', JSON.stringify(lgrs));
		loggers.set(lgrs);

		successMsg = "loggers saved! Sort by logger on the homepage!"
		snackbarSuccess.forceOpen();
	}

	function removeThis(index: number) {
		if (index < 1 && lgrs.length === 1) {
			return;
		}
		lgrs.splice(index, 1);
		lgrs = lgrs;
	}

	function addNewLogger() {
		lgrs.push({
			name: '',
			url: ''
		});
		lgrs = lgrs;
	}

	function getLoggers() {
		try {
			let stringObject = localStorage.getItem('loggers');
			if (stringObject) {
				lgrs = <Logger[]>JSON.parse(stringObject);
			}
		} catch (err) {
			console.error(err);
		}
	}

	onMount(() => {
		getLoggers();
		//saveData();
	});
</script>

<div>
	<Flex style="margin: 2rem auto">
		<h1>Settings</h1>
	</Flex>
	<Flex style="margin-bottom: 2rem">
		<Card variant="outlined">
			<Content>Add extlog loggers here.</Content>
		</Card>
	</Flex>
	<Flex direction="column">
		{#each lgrs as logger, i}
			<Paper color="primary" variant="outlined" style="max-width: 70%; margin-bottom: 1em;">
				<LayoutGrid style="padding: 0 0.5em">
					<Cell span={12}>
						<Flex justify="end">
							<IconButton
								style="color: #fff"
								on:click={() => removeThis(i)}
							>
								<Icon class="material-icons">close</Icon>
							</IconButton>
						</Flex>
					</Cell>
					<Cell span={labelNameWidth} style="text-align: right;">
						<p>Name:</p>
					</Cell>
					<Cell span={nameWidth}>
						<Textfield
							variant="outlined"
							bind:value={logger.name}
							label="name"
							style="width: 100%;"
						>
							<HelperText slot="helper">Filer00{i + 1}</HelperText>
						</Textfield>
					</Cell>
					<Cell span={labelURLWidth} style="text-align: right;">
						<p>URL:</p>
					</Cell>
					<Cell span={urlWidth}>
						<Textfield variant="outlined" bind:value={logger.url} label="url" style="width: 100%;">
							<HelperText slot="helper">http://localhost:9000/get_logs</HelperText>
						</Textfield>
					</Cell>
				</LayoutGrid>
			</Paper>
		{/each}
		<div id="controls">
			<Flex>
				<Button on:click={() => clearAll()} variant="outlined" style="width: 120px">
					<Label>Clear All</Label>
				</Button>
				<Button
					on:click={() => addNewLogger()}
					variant="raised"
					style="margin-left: 2em; width: 120px"
				>
					<Label>Add</Label>
				</Button>
				<Button on:click={() => saveData()} variant="raised" style="margin-left: 2em; width: 120px">
					<Label>Save</Label>
				</Button>
			</Flex>
		</div>
	</Flex>
	<Snackbar bind:this={snackbarSuccess} class="snackbar-success">
		<Label
		  >{successMsg}</Label
		>
		<Actions>
		  <IconButton class="material-icons" title="Dismiss">close</IconButton>
		</Actions>
	</Snackbar>
</div>

<style>
	#controls {
		margin-top: 2em;
	}
</style>
