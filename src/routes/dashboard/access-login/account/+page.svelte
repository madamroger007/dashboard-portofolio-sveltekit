<script lang="ts">
	import { goto } from '$app/navigation';
	import DataTable, { type TableColumn, type DataTableRow } from '$lib/components/DataTable.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster, toast } from 'svelte-sonner';
	import ConfirmDialog from '$lib/components/modal/ConfirmDialog.svelte';
	const columns: TableColumn[] = [
		// { key: 'id', label: 'ID' },
		{ key: 'username', label: 'Nama' },
		{ key: 'email', label: 'Email' },
		{ key: 'role', label: 'Role' },
		{ key: 'updatedAt', label: 'Diubah Sejak' },
		{ key: 'createdAt', label: 'Dibuat Sejak' }
	];

	// data dari page server
	export let data: { accounts: DataTableRow[] };
	let rows: DataTableRow[] = data.accounts;

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

	// hasil data yang sudah difilter
	$: filteredRows = rows.filter((row) => {
		// filter search (nama/email/role)
		const q = search.toLowerCase();
		const matchesSearch =
			row.username.toLowerCase().includes(q) ||
			row.email.toLowerCase().includes(q) ||
			row.role.toLowerCase().includes(q);

		// filter bulan
		const createdDate = new Date(row.createdAt);
		const matchesMonth = month
			? String(createdDate.getMonth() + 1).padStart(2, '0') === month
			: true;

		// filter tahun
		const matchesYear = year ? String(createdDate.getFullYear()) === year : true;

		return matchesSearch && matchesMonth && matchesYear;
	});

	// total untuk pagination
	$: total = filteredRows.length;

	// data untuk ditampilkan sesuai halaman
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
		if (confirmAction === 'update')
			goto(`/dashboard/access-login/account/form?id=${selectedRow.id}`);
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
				} else toast.error('Gagal menghapus data');
			} catch (err) {
				console.error(err);
				toast.error('Terjadi kesalahan koneksi');
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
		<h1 class="text-xl font-bold">Data Account</h1>
		<Button onclick={() => goto('/dashboard/access-login/account/form')}>Create Data Baru</Button>
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
