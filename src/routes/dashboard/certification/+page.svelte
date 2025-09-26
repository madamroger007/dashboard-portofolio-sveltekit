<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DataTable, { type TableColumn, type DataTableRow } from '$lib/components/DataTable.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster, toast } from 'svelte-sonner';
	import ConfirmDialog from '$lib/components/modal/ConfirmDialog.svelte';
	import syncRows from '$lib/utils/loadSyncLocalStorage';
	const columns: TableColumn[] = [
		// { key: 'id', label: 'ID' },
		{ key: 'title', label: 'Title' },
		{ key: 'link_cert', label: 'Link Certificate' },
		{ key: 'name_institution', label: 'Name Institusi' },
		{ key: 'time_cert', label: 'Time Certificate' },
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'updatedAt', label: 'Updated At' }
	];

	// data from page server
	export let data: { getData: DataTableRow[] };
	let rows: DataTableRow[] = data.getData;

	// Initial load
	onMount(() => {
		syncRows(data.getData, rows, 'certifRows');
	});

	// state filter/search
	let search = '';
	let month: string = '';
	let year: string = '';
	let page = 1;
	let pageSize = 5;
	// state modal
	let showConfirm = false;
	let confirmAction: 'delete' | 'update' | null = null;
	let selectedRow: DataTableRow | null = null;

	// result filter
	$: filteredRows = rows.filter((row) => {
		// filter search (nama/email/role)
		const q = search.toLowerCase();
		const matchesSearch =
			row.title.toLowerCase().includes(q) || row.name_institution.toLowerCase().includes(q);

		// filter month
		const createdDate = new Date(row.createdAt);
		const matchesMonth = month
			? String(createdDate.getMonth() + 1).padStart(2, '0') === month
			: true;

		// filter year
		const matchesYear = year ? String(createdDate.getFullYear()) === year : true;

		return matchesSearch && matchesMonth && matchesYear;
	});

	// total for pagination
	$: total = filteredRows.length;

	// data for display
	$: paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

	// handler events dari DataTable
	function handleSearch(e: CustomEvent) {
		search = e.detail;
		page = 1; // reset ke halaman 1 saat cari
	}

	function handleFilterMonth(e: CustomEvent) {
		month = e.detail;
		page = 1;
	}

	function handleFilterYear(e: CustomEvent) {
		year = e.detail;
		page = 1;
	}

	function handlePaginate(e: CustomEvent) {
		page = e.detail;
	}

	function handleEdit(e: CustomEvent) {
		selectedRow = e.detail;
		confirmAction = 'update';
		showConfirm = true;
	}

	function handleDelete(e: CustomEvent) {
		selectedRow = e.detail;
		confirmAction = 'delete';
		showConfirm = true;
	}

	async function onConfirm() {
		if (!selectedRow) return;
		if (confirmAction === 'update') goto(`/dashboard/certification/form?id=${selectedRow.id}`);
		if (confirmAction === 'delete') {
			try {
				const formData = new URLSearchParams();
				formData.append('id', selectedRow.id);
				const res = await fetch(`?/delete`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: formData.toString()
				});
				if (res.ok) {
					rows = rows.filter((row) => row.id !== selectedRow?.id);
					toast.success('Deleted successfully', {
						duration: 3000
					});
				} else toast.error('failed to delete data');
			} catch (err) {
				console.error(err);
				toast.error('A connection error occurred');
			}
		}
		showConfirm = false;
		confirmAction = null;
		selectedRow = null;
	}
</script>

<div class="space-y-4">
	<Toaster position="top-right" />
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Data Certification</h1>
		<Button onclick={() => goto('/dashboard/certification/form')}>Create New</Button>
	</div>
	<DataTable
		{columns}
		data={paginatedRows}
		{page}
		{pageSize}
		{total}
		on:search={handleSearch}
		on:filterMonth={handleFilterMonth}
		on:filterYear={handleFilterYear}
		on:paginate={handlePaginate}
		on:edit={handleEdit}
		on:delete={handleDelete}
	/>

	<ConfirmDialog
		open={showConfirm}
		on:confirm={onConfirm}
		on:cancel={() => (showConfirm = false)}
		title={confirmAction === 'delete' ? 'Delete Data' : 'Update Data'}
		description={confirmAction === 'delete'
			? 'Are you sure you want to delete this data?'
			: 'Are you sure you want to update this data?'}
		confirmText={confirmAction === 'delete' ? 'Delete' : 'Update'}
		variant={confirmAction === 'delete' ? 'destructive' : 'default'}
	/>
</div>
