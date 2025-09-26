<script lang="ts">
	import { goto } from '$app/navigation';
	import DataTable, { type TableColumn, type DataTableRow } from '$lib/components/DataTable.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from 'svelte-sonner';
	import ConfirmDialog from '$lib/components/modal/ConfirmDialog.svelte';
	import { createDataTable } from '$lib/hooks/page-table-load.svelte';

	export let data: { getData: DataTableRow[] };
	const columns: TableColumn[] = [
		// { key: 'id', label: 'ID' },
		{ key: 'title', label: 'Title' },
		{ key: 'link_cert', label: 'Link Certificate' },
		{ key: 'name_institution', label: 'Name Institusi' },
		{ key: 'time_cert', label: 'Time Certificate' },
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'updatedAt', label: 'Updated At' }
	];
	// State data table
	const dt = createDataTable(
		data.getData,
		'?/delete',
		'/dashboard/access-login/account/form?id=',
		'certifRows' // key untuk localStorage
	);

	const {
		rows,
		paginatedRows,
		page,
		pageSize,
		total,
		showConfirm,
		confirmAction,
		handleSearch,
		handleFilterMonth,
		handleFilterYear,
		handlePaginate,
		handleEdit,
		handleDelete,
		onConfirm
	} = dt;
</script>

<div class="space-y-4">
	<Toaster position="top-right" />
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Data Certification</h1>
		<Button onclick={() => goto('/dashboard/certification/form')}>Create New</Button>
	</div>

	<DataTable
		{columns}
		data={$paginatedRows}
		page={$page}
		pageSize={$pageSize}
		total={$total}
		on:search={handleSearch}
		on:filterMonth={handleFilterMonth}
		on:filterYear={handleFilterYear}
		on:paginate={handlePaginate}
		on:edit={handleEdit}
		on:delete={handleDelete}
	/>

	<ConfirmDialog
		open={$showConfirm}
		on:confirm={onConfirm}
		on:cancel={() => showConfirm.set(false)}
		title={$confirmAction === 'delete' ? 'Delete Data' : 'Update Data'}
		description={$confirmAction === 'delete'
			? 'Are you sure you want to delete this data?'
			: 'Are you sure you want to update this data?'}
		confirmText={$confirmAction === 'delete' ? 'Delete' : 'Update'}
		variant={$confirmAction === 'delete' ? 'destructive' : 'default'}
	/>
</div>
