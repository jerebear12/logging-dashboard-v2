<script lang="ts">
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import DataTable, { Head, Body, Row, Cell, SortValue, Pagination } from '@smui/data-table';
    import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	//import type { User } from '../types/User';
	import type { TabEntry } from '../types/TabEntry';
    import type { Log } from '../types/Log';
	import { onMount } from 'svelte';
    import { loggedIn } from '../stores/state';
    import { user } from '../stores/state';
    import { client } from '../stores/state';
    import PocketBase from 'pocketbase';

    const LOG_COLLECTION = "log"

	const key = (tab: TabEntry) => tab.key;

	// TODO
	// Popualate by loggers added
	let tabs: TabEntry[] = [
		{
			key: 1,
			label: 'Filer001'
		},
		{
			key: 2,
			label: 'Filer002'
		},
		{
			key: 3,
			label: 'Filer003'
		},
		{
			key: 4,
			label: 'Filer004'
		},
		{
			key: 5,
			label: 'Filer005'
		}
	];
	let active = tabs[0];

	let cells = ['Level', 'Date', 'Time', 'File', 'Line', 'Message', 'Server Name'];

	let items: Log[] = [];
	let sort: keyof Log = 'date';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';
    let rowsPerPage = 20;  // has to match option 1
	let currentPage = 0;

	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, items.length);
	$: slice = items.slice(start, end);
	$: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}

	function handleSort() {
		items.sort((a, b) => {
			const [aVal, bVal] = [a[sort], b[sort]][
				sortDirection === 'ascending' ? 'slice' : 'reverse'
			]();
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal);
			}
			return Number(aVal) - Number(bVal);
		});
		items = items;
	}

    async function initLogList(collection: string) {
		var logs = await client.collection(collection).getList(1, 50, {
			sort: '-created'
		});
		return logs.items;
	}

    onMount(async () => {
        if (loggedIn) {  // TODO Check store to see if account info is stored
		    const adminAuthData = await client.admins.authWithPassword(user.email, user.password);
            await initLogList(LOG_COLLECTION);
        } else {
            
        }
    })

	// if (typeof fetch !== 'undefined') {
	// 	// Slice a few off the end to show how the
	// 	// last page looks when it's not full.
	// 	fetch(
	// 		'https://gist.githubusercontent.com/hperrin/e24a4ebd9afdf2a8c283338ae5160a62/raw/dcbf8e6382db49b0dcab70b22f56b1cc444f26d4/todos.json'
	// 	)
	// 		.then((response) => response.json())
	// 		.then((json) => (items = json.slice(0, 197)));
	// }
</script>

<div>
	<TabBar {tabs} let:tab {key} bind:active>
		<Tab {tab} stacked={true} indicatorSpanOnlyContent={true} tabIndicator$transition="fade">
			<Label>{tab.label}</Label>
		</Tab>
	</TabBar>
	<DataTable
		sortable
		bind:sort
		bind:sortDirection
		on:SMUIDataTable:sorted={handleSort}
		table$aria-label="Log list"
		style="width: 100%;"
	>
		<Head>
			<Row>
				{#each cells as cell, i}
					{#if i == 0}
						<Cell columnId={cell.toLowerCase()}>
							<!-- For numeric columns, icon comes first. -->
							<IconButton class="material-icons">arrow_upward</IconButton>
							<Label>{cell}</Label>
						</Cell>
					{:else}
						<Cell columnId={cell.toLowerCase()}>
							<Label>{cell}</Label>
							<IconButton class="material-icons">arrow_upward</IconButton>
						</Cell>
					{/if}
				{/each}
			</Row>
		</Head>

		<Body>
			{#each slice as item, i}
				<Row>
					<Cell>{item.level}</Cell>
					<Cell>{item.date}</Cell>
					<Cell>{item.time}</Cell>
					<Cell>{item.file}</Cell>
					<Cell>{item.line}</Cell>
                    <Cell>{item.message}</Cell>
                    <Cell>{item.server_name}</Cell>
				</Row>
			{/each}
		</Body>

		<Pagination slot="paginate">
			<svelte:fragment slot="rowsPerPage">
				<Label>Rows Per Page</Label>
				<Select variant="outlined" bind:value={rowsPerPage} noLabel>
					<Option value={20}>20</Option>
					<Option value={50}>50</Option>
					<Option value={100}>100</Option>
				</Select>
			</svelte:fragment>
			<svelte:fragment slot="total">
				{start + 1}-{end} of {items.length}
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

	<pre class="status">Selected: {active.key}</pre>
</div>
