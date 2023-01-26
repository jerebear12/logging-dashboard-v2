<script lang="ts">
	// @ts-ignore
	import Flex from 'svelte-flex';
	import Paper, { Title } from '@smui/paper';
	import Select, { Option } from '@smui/select';
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import DataTable, { Head, Body, Row, Cell as TableCell, Pagination } from '@smui/data-table';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import IconButton from '@smui/icon-button';
	import { onMount } from 'svelte';
	import { user, pb, loggers } from '../stores/state';
	import type PocketBase from 'pocketbase';
	import type { User } from '../types/User';
	import type { Client } from '../types/Client';
	import type { Logger } from '../types/Logger';
	import Button from '@smui/button';
	import { SortDirection } from '../types/SortDirection';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import Snackbar, { Actions } from '@smui/snackbar';

	let labelWidth = 2;
	let selectMenuWidth = 2;
	let searchBarWidth = 6;
	let buttonWidth = 4;

	let snackbarError: Snackbar;
	let errorMsg = 'Sorry, that didn\'t work, please try again!';

	const LOG_COLLECTION = 'log';

	const STR_SEP = "'";
	const CONTAINS = '~';
	const EQUALS = '=';
	const AALO = '?=';
	const AALOC = '?~';
	const MESSAGE = 'full_log'; // Column name on server that holds full log
	const CREATED = 'created';
	const SERVER_NAME = 'server_name';
	const OR = '||';
	const AND = '&&';

	let client: PocketBase;
	let usr: User;
	let lgrs: Logger[] = [];

	let active: Logger;

	pb.subscribe((value) => {
		client = value;
	});
	user.subscribe((value) => {
		usr = value;
	});
	loggers.subscribe((value) => {
		lgrs = value;
	});

	function getUser() : boolean {
		let success = false;
		try {
			let stringObject = localStorage.getItem('user');
			if (stringObject) {
				usr = JSON.parse(stringObject);
				success = true;
			} else {
				console.log('No user data found');
			}
		} catch (err) {
			console.error(err);
		}
		return success;
	}

	function getClient() : boolean {
		let success = false;
		try {
			let stringObject = localStorage.getItem('client');
			if (stringObject) {
				let urlData = <Client>JSON.parse(stringObject);
				pb.setURL(urlData.URL);
				success = true;
			} else {
				console.log('No client data found');
			}
		} catch (err) {
			console.error(err);
		}
		return success;
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

	let directions = ['Ascending', 'Descending'];
	let columns = ['level', 'date', 'time', 'file', 'line', 'message', 'server_name'];
	let columnNames = ['Level', 'Date', 'Time', 'File', 'Line', 'Message', 'Server Name'];

	// has to be implicit to accept Record[] type from pb
	let logs = [];
	let sortDirection = SortDirection.DESCENDING;
	let sortColumn = 'date';
	let searchTerm = '';
	let specific: boolean = false;
	let rowsPerPage = 30; // has to match option 1
	let currentPage = 0;

	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, logs.length);
	$: slice = logs.slice(start, end);
	$: lastPage = Math.max(Math.ceil(logs.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}

	async function initLogList() {
		let data;
		if (active.name === 'All') {
			data = await client.collection(LOG_COLLECTION).getList(currentPage, rowsPerPage, {
				sort: sortDirection + CREATED
			});
		} else {
			data = await client.collection(LOG_COLLECTION).getList(currentPage, rowsPerPage, {
				sort: sortDirection + CREATED,
				filter: SERVER_NAME + EQUALS + STR_SEP + active.name + STR_SEP
			});
		}
		return data.items;
	}

	function setSortDirection(direction: string) {
		if (direction.toLowerCase() == directions[0].toLowerCase()) {
			sortDirection = SortDirection.ASCENDING;
		} else {
			sortDirection = SortDirection.DESCENDING;
		}
	}

	async function handleSort() {
		logs = [];
		let data;
		if (active.name == 'All') {
			data = await client.collection(LOG_COLLECTION).getFullList(rowsPerPage, {
				sort: sortDirection + CREATED + ',' + sortColumn
			});
		} else {
			data = await client.collection(LOG_COLLECTION).getFullList(rowsPerPage, {
				sort: sortDirection + CREATED + ',' + sortColumn,
				filter: SERVER_NAME + EQUALS + STR_SEP + active.name + STR_SEP
			});
		}
		logs = data;
	}

	async function handleSearch() {
		logs = [];
		let data;
		if (!specific) {
			if (active.name == 'All') {
				data = await client.collection(LOG_COLLECTION).getFullList(rowsPerPage, {
					sort: sortDirection + CREATED + ',' + sortColumn,
					filter:
						'(' +
						MESSAGE +
						CONTAINS +
						STR_SEP +
						searchTerm +
						STR_SEP +
						OR +
						MESSAGE +
						AALO +
						STR_SEP +
						searchTerm +
						STR_SEP +
						OR +
						MESSAGE +
						AALOC +
						STR_SEP +
						searchTerm +
						STR_SEP +
						')'
				});
			} else {
				data = await client.collection(LOG_COLLECTION).getFullList(rowsPerPage, {
					sort: sortDirection + CREATED + ',' + sortColumn,
					filter:
						'(' +
						SERVER_NAME +
						EQUALS +
						STR_SEP +
						active.name +
						STR_SEP +
						AND +
						MESSAGE +
						CONTAINS +
						STR_SEP +
						searchTerm +
						STR_SEP +
						OR +
						SERVER_NAME +
						EQUALS +
						STR_SEP +
						active.name +
						STR_SEP +
						AND +
						MESSAGE +
						AALO +
						STR_SEP +
						searchTerm +
						STR_SEP +
						OR +
						SERVER_NAME +
						EQUALS +
						STR_SEP +
						active.name +
						STR_SEP +
						AND +
						MESSAGE +
						AALOC +
						STR_SEP +
						searchTerm +
						STR_SEP +
						')'
				});
			}
		} else {
			if (active.name == 'All') {
				data = await client.collection(LOG_COLLECTION).getFullList(rowsPerPage, {
					sort: sortDirection + CREATED + ',' + sortColumn,
					filter:
						'(' +
						MESSAGE +
						CONTAINS +
						STR_SEP +
						searchTerm +
						STR_SEP +
						')'
				});
			} else {
				data = await client.collection(LOG_COLLECTION).getFullList(rowsPerPage, {
					sort: sortDirection + CREATED + ',' + sortColumn,
					filter:
						'(' +
						SERVER_NAME +
						EQUALS +
						STR_SEP +
						active.name +
						STR_SEP +
						AND +
						MESSAGE +
						CONTAINS +
						STR_SEP +
						searchTerm +
						STR_SEP +
						')'
				});
			}
		}
		if (data.length < 1) {
			console.log("No data from search")
			errorMsg = "No data from search, try another search term."
			snackbarError.forceOpen()
		}
		logs = data;
	}

	function refreshLogs() {
		lgrs.forEach((logger) => {
			fetch(logger.url);
		});
	}

	onMount(async () => {
		if (!getClient() || !getUser()) {
			errorMsg = "No account information. Please go to the Account or About page.";
			snackbarError.forceOpen();
			return;
		}
		getLoggers();
		active = lgrs[0];

		if (client.baseUrl !== null && client.baseUrl !== undefined && client.baseUrl !== "") {
			await client.admins.authWithPassword(usr.email, usr.password);
			logs = await initLogList();
		} else {
			errorMsg = "No PocketBase URL found, please check your account settings.";
			snackbarError.forceOpen();
		}
	});
</script>

<div>
	<Flex>
		<TabBar tabs={lgrs} let:tab>
			<Tab
				{tab}
				stacked={true}
				indicatorSpanOnlyContent={true}
				tabIndicator$transition="fade"
				on:click={async () => {
					active = tab;
					logs = await initLogList();
				}}
			>
				<Label>{tab.name}</Label>
			</Tab>
		</TabBar>
		<div class="refresh-button">
			<Button variant="raised" style="margin: 0em 1em;" on:click={() => refreshLogs()}>
				<Label>Refresh</Label>
			</Button>
		</div>
	</Flex>
	<Flex>
		<Paper color="primary" variant="outlined" style="max-width: 1100px; margin: 2em 0em;">
			<Title>Sort Parameters</Title>
			<LayoutGrid>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Sort Direction:</p>
				</Cell>
				<Cell span={selectMenuWidth}>
					<Select label="Select" style="width: 100%;" value={directions[1]}>
						{#each directions as direction}
							<Option value={direction} on:click={() => setSortDirection(direction)}
								>{direction}</Option
							>
						{/each}
					</Select>
				</Cell>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Sort Column:</p>
				</Cell>
				<Cell span={selectMenuWidth}>
					<Select bind:value={sortColumn} label="Select" style="width: 100%;">
						{#each columnNames as column, i}
							<Option value={columns[i]}>{column}</Option>
						{/each}
					</Select>
				</Cell>
				<Cell span={buttonWidth}>
					<Button
						variant="raised"
						style="margin: 0.8em 0em; width: 6em;"
						on:click={() => handleSort()}
					>
						<Label>Sort</Label>
					</Button>
				</Cell>
				<Cell span={labelWidth} style="text-align: right;">
					<p>Search:</p>
				</Cell>
				<Cell span={searchBarWidth}>
					<Textfield variant="outlined" bind:value={searchTerm} label="Search" style="width: 100%;">
						<HelperText slot="helper" />
					</Textfield>
				</Cell>
				<Cell span={1}>
					<Button
						variant="raised"
						style="margin: 0.8em 0em; width: 6em;"
						on:click={() => handleSearch()}
					>
						<Label>Search</Label>
					</Button>
				</Cell>
				<Cell span={labelWidth} style="text-align: right; margin-top: 0.3em;">
					<Wrapper>
						<FormField align="end">
							<p slot="label">Specific:</p>
							<Switch bind:checked={specific} />
						</FormField>
						<Tooltip unbounded xPos="start">Beta feature. Can increase search accuracy when enabled.</Tooltip>
					</Wrapper>
				</Cell>
			</LayoutGrid>
		</Paper>
	</Flex>

	<DataTable table$aria-label="Log list" style="width: 98%; margin: auto 1%;">
		<Head>
			<Row>
				{#each columnNames as cell, i}
					<TableCell columnId={cell.toLowerCase()}>
						<Label>{cell}</Label>
					</TableCell>
				{/each}
			</Row>
		</Head>
		<Body>
			{#each slice as log, i}
				<Row>
					<TableCell>{log.level}</TableCell>
					<TableCell>{log.date}</TableCell>
					<TableCell>{log.time}</TableCell>
					<TableCell>{log.file}</TableCell>
					<TableCell>{log.line}</TableCell>
					<TableCell>{log.message}</TableCell>
					<TableCell>{log.server_name}</TableCell>
				</Row>
			{/each}
		</Body>

		<Pagination slot="paginate">
			<svelte:fragment slot="rowsPerPage">
				<Label>Rows Per Page</Label>
				<Select variant="outlined" bind:value={rowsPerPage} noLabel>
					<Option value={30}>30</Option>
					<Option value={50}>50</Option>
					<Option value={100}>100</Option>
				</Select>
			</svelte:fragment>
			<svelte:fragment slot="total">
				{start + 1}-{end} of {logs.length}
			</svelte:fragment>

			<IconButton
				class="material-icons"
				action="first-page"
				title="First page"
				on:click={() => (currentPage = 0)}
				disabled={currentPage === 0}>first_page</IconButton
			>
			<IconButton
				class="material-icons"
				action="prev-page"
				title="Prev page"
				on:click={() => currentPage--}
				disabled={currentPage === 0}>chevron_left</IconButton
			>
			<IconButton
				class="material-icons"
				action="next-page"
				title="Next page"
				on:click={() => currentPage++}
				disabled={currentPage === lastPage}>chevron_right</IconButton
			>
			<IconButton
				class="material-icons"
				action="last-page"
				title="Last page"
				on:click={() => (currentPage = lastPage)}
				disabled={currentPage === lastPage}>last_page</IconButton
			>
		</Pagination>
	</DataTable>
	<Snackbar bind:this={snackbarError} class="snackbar-error">
		<Label
		  >{errorMsg}</Label
		>
		<Actions>
		  <IconButton class="material-icons" title="Dismiss">close</IconButton>
		</Actions>
	</Snackbar>
</div>
