<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from 'svelte-sonner';
	import DataTable, { type DataTableRow, type TableColumn } from '$lib/components/DataTable.svelte';
	import ConfirmDialog from '$lib/components/modal/ConfirmDialog.svelte';
	import { createDataTable } from '$lib/hooks/page-table-load.svelte';

	export let data: { getData: DataTableRow[] };

	const columns: TableColumn[] = [
		{ key: 'username', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'role', label: 'Role' },
		{ key: 'token', label: 'Token API' },
		{ key: 'updatedAt', label: 'Updated At' },
		{ key: 'createdAt', label: 'Created At' }
	];

	const dt = createDataTable(
		data.getData,
		'?/delete',
		'/dashboard/access-login/account/form?id=',
		'accountRows'
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
		<h1 class="text-xl font-bold">Data Account</h1>
		<div class="flex gap-4">
			<Button onclick={() => goto('/dashboard/access-login/account/form')}>Create New</Button>
		</div>
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
