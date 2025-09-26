<script context="module" lang="ts">
	export type TableColumn = { key: string; label: string };
	export type DataTableRow = { [key: string]: any };
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	// NOTE: beberapa implementasi Select svelte tidak mengekspor SelectValue, jadi kita tidak impor itu
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';
	import { ChevronLeft, ChevronRight, Pencil, Trash2 } from '@lucide/svelte';

	export let columns: TableColumn[] = [];
	export let data: DataTableRow[] = [];
	export let page = 1;
	export let pageSize = 5;
	export let total = 0;

	const month: string = '';
	const year: string = '';
	let search = '';

	const dispatch = createEventDispatcher();

	// reactive total pages
	$: totalPages = Math.max(1, Math.ceil(total / pageSize));

	// menerima event apapun (some Select implementations memberikan string | string[])

	function handleSearch(e: any) {
		const val = e.target.value;
		dispatch('search', val);
	}

	function handleFilterMonth(value: string | string[]) {
		const selected = Array.isArray(value) ? value[0] : value;
		dispatch('filterMonth', selected);
	}

	function handleFilterYear(value: string | string[]) {
		const selected = Array.isArray(value) ? value[0] : value;
		dispatch('filterYear', selected);
	}

	function prevPage() {
		if (page > 1) dispatch('paginate', page - 1);
	}

	function nextPage() {
		if (page < totalPages) dispatch('paginate', page + 1);
	}
</script>

<Card>
	<CardContent class="space-y-4 p-4">
		<!-- Filter & Search -->
		<div class="flex flex-col items-center justify-between gap-2 md:flex-row">
			<div class="flex gap-2">
				<!-- Select Bulan -->
				<Select type="single" value={month} onValueChange={handleFilterMonth}>
					<SelectTrigger class="w-[140px]">
						<span class="text-sm text-muted-foreground">
							{month ? month : 'Pilih Bulan'}
						</span>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="01">Januari</SelectItem>
						<SelectItem value="02">Februari</SelectItem>
						<SelectItem value="03">Maret</SelectItem>
						<SelectItem value="04">April</SelectItem>
						<SelectItem value="05">Mei</SelectItem>
						<SelectItem value="06">Juni</SelectItem>
						<SelectItem value="07">Juli</SelectItem>
						<SelectItem value="08">Agustus</SelectItem>
						<SelectItem value="09">September</SelectItem>
						<SelectItem value="10">Oktober</SelectItem>
						<SelectItem value="11">November</SelectItem>
						<SelectItem value="12">Desember</SelectItem>
					</SelectContent>
				</Select>

				<!-- Select Tahun -->
				<Select type="single" value={year} onValueChange={handleFilterYear}>
					<SelectTrigger class="w-[140px]">
						<span class="text-sm text-muted-foreground">
							{year ? year : 'Pilih Tahun'}
						</span>
					</SelectTrigger>
					<SelectContent>
						{#each Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 5 + i) as y}
							<SelectItem value={String(y)}>{y}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>

			<!-- Input search: bind value dan dispatch saat input -->
			<SearchInput
				value={search}
				placeholder="Cari data"
				on:change={(e) => handleSearch({ target: { value: e.detail } })}
			/>
		</div>

		<!-- Table (shadcn/ui) -->
		<div class="overflow-x-auto rounded-md border">
			<Table class="min-w-full table-auto">
				<TableHeader>
					<TableRow>
						{#each columns as col}
							<TableHead class="whitespace-nowrap">{col.label}</TableHead>
						{/each}
						<TableHead class="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{#if data && data.length > 0}
						{#each data as row (row.id ?? row)}
							<TableRow>
								{#each columns as col}
									<TableCell class="max-w-[180px] px-2 py-1 align-top">
										<!-- Text truncate dengan tooltip -->
										<span class="block cursor-text whitespace-normal break-words" title={row[col.key]}>
											{row[col.key]}
										</span>
									</TableCell>
								{/each}

								<TableCell class="flex items-center justify-end gap-2">
									<Button
										size="icon"
										variant="ghost"
										onclick={() => dispatch('edit', row)}
										aria-label="Edit"
									>
										<Pencil class="h-4 w-4" />
									</Button>

									<Button
										size="icon"
										variant="ghost"
										onclick={() => dispatch('delete', row)}
										aria-label="Hapus"
									>
										<Trash2 class="h-4 w-4 text-red-500" />
									</Button>
								</TableCell>
							</TableRow>
						{/each}
					{:else}
						<tr>
							<td colspan={columns.length + 1} class="py-6 text-center text-muted-foreground">
								Tidak ada data
							</td>
						</tr>
					{/if}
				</TableBody>
			</Table>
		</div>

		<!-- Pagination -->
		<div class="flex items-center justify-between pt-2">
			<span class="text-sm text-muted-foreground">
				Halaman {page} dari {totalPages}
			</span>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md border p-1"
					on:click={prevPage}
					disabled={page === 1}
				>
					<ChevronLeft class="h-4 w-4" />
				</button>

				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md border p-1"
					on:click={nextPage}
					disabled={page >= totalPages}
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>
		</div>
	</CardContent>
</Card>
