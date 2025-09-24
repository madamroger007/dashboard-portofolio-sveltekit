<script lang="ts">
	import { goto } from '$app/navigation';
	import DataTable, { type TableColumn, type DataTableRow } from '$lib/components/DataTable.svelte';
	import { Button } from '$lib/components/ui/button';

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
		alert('Edit: ' + e.detail.username);
		// route ke halaman edit atau tampilkan modal edit
		// Contoh kalau mau route ke halaman edit
		goto(`/dashboard/access-login/account/edit/${e.detail.id}`);
	}

	async function handleDelete(e: CustomEvent) {
		if (confirm(`Yakin ingin hapus ${e.detail.username}?`)) {
			try {
				const res = await fetch(`/api/accounts/${e.detail.id}`, {
					method: 'DELETE'
				});

				if (res.ok) {
					// hapus dari state lokal supaya UI langsung update
					rows = rows.filter((r) => r.id !== e.detail.id);
				} else {
					alert('Gagal menghapus data');
				}
			} catch (err) {
				console.error(err);
				alert('Terjadi kesalahan koneksi');
			}
		}
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Data Account</h1>
		<Button onclick={() => goto('/dashboard/access-login/account/form')}
			>Create Data Baru</Button
		>
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
</div>
