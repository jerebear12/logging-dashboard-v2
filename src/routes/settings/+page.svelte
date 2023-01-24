<script lang="ts">
	// @ts-ignore
	import Flex from 'svelte-flex';
	import Paper from '@smui/paper';
	import Textfield from '@smui/textfield';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import HelperText from '@smui/textfield/helper-text';
	import Card, { Content } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import type { Logger } from '../../types/Logger';

	let labelNameWidth = 1;
	let labelURLWidth = 1;
	let nameWidth = 4;
	let urlWidth = 6;

	let emptyLogger = {
		name: '',
		url: ''
	};

	let lgrs: Logger[] = [
		{
			name: '',
			url: ''
		}
	];

	$: loggers = lgrs;

	function clearAll() {
		loggers = [
			{
				name: '',
				url: ''
			}
		];
	}

	function saveData() {
		loggers.forEach((logger) => {
			// Save to local and store
		});
	}

	function removeThis(index: number) {
		if (index < 1 && loggers.length === 1) {
			return;
		}
		loggers.splice(index, 1);
		loggers = loggers;
	}

	function addNewLogger() {
		loggers.push({
			name: '',
			url: ''
		});
		loggers = loggers;
	}
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
		{#each loggers as logger, i}
			<Paper style="max-width: 70%; margin-bottom: 1em;">
				<LayoutGrid style="padding: 0 0.5em">
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
					<Cell span={12}>
						<Flex>
							<Button
								on:click={() => removeThis(i)}
								variant="unelevated"
								style="width: 120px; background-color: rgba(163, 59, 59, 0.844);"
							>
								<Label>Delete</Label>
							</Button>
						</Flex>
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
</div>

<style>
	#controls {
		margin-top: 2em;
	}
</style>
