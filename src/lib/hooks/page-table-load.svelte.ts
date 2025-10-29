// src/lib/hooks/page-table-load.svelte
import { writable, derived, type Writable, type Readable, get } from 'svelte/store';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import type { DataTableRow } from '$lib/components/DataTable.svelte';
import syncRows from '$lib/hooks/load-sync-localstorage.svelte';

export interface DataTableState {
    rows: Writable<DataTableRow[]>;
    search: Writable<string>;
    month: Writable<string>;
    year: Writable<string>;
    page: Writable<number>;
    pageSize: Writable<number>;
    showConfirm: Writable<boolean>;
    confirmAction: Writable<'delete' | 'update' | null>;
    selectedRow: Writable<DataTableRow | null>;
    total: Readable<number>;
    paginatedRows: Readable<DataTableRow[]>;
    handleSearch: (e: CustomEvent) => void;
    handleFilterMonth: (e: CustomEvent) => void;
    handleFilterYear: (e: CustomEvent) => void;
    handlePaginate: (e: CustomEvent) => void;
    handleEdit: (e: CustomEvent) => void;
    handleDelete: (e: CustomEvent) => void;
    onConfirm: () => Promise<void>;
}

export function createDataTable(
    initialRows: DataTableRow[],
    deleteUrl: string,
    editUrlPrefix: string,
    storageKey?: string,
    fetchServerData?: () => Promise<DataTableRow[]>
): DataTableState {
    const rows = writable<DataTableRow[]>(initialRows);
    const search = writable('');
    const month = writable('');
    const year = writable('');
    const page = writable(1);
    const pageSize = writable(5);
    const showConfirm = writable(false);
    const confirmAction = writable<'delete' | 'update' | null>(null);
    const selectedRow = writable<DataTableRow | null>(null);

    const filteredRows = derived(
        [rows, search, month, year],
        ([$rows, $search, $month, $year]) => {
            const q = $search.toLowerCase();
            return $rows.filter(row => {
                const matchesSearch = Object.values(row).some(v =>
                    String(v).toLowerCase().includes(q)
                );
                const createdDate = new Date(row.createdAt);
                const matchesMonth = $month ? String(createdDate.getMonth() + 1).padStart(2, '0') === $month : true;
                const matchesYear = $year ? String(createdDate.getFullYear()) === $year : true;
                return matchesSearch && matchesMonth && matchesYear;
            });
        }
    );

    const total = derived(filteredRows, $filteredRows => $filteredRows.length);
    const paginatedRows = derived(
        [filteredRows, page, pageSize],
        ([$filteredRows, $page, $pageSize]) => $filteredRows.slice(($page - 1) * $pageSize, $page * $pageSize)
    );

    // --- Handlers ---
    const handleSearch = (e: CustomEvent) => { search.set(e.detail); page.set(1); };
    const handleFilterMonth = (e: CustomEvent) => { month.set(e.detail); page.set(1); };
    const handleFilterYear = (e: CustomEvent) => { year.set(e.detail); page.set(1); };
    const handlePaginate = (e: CustomEvent) => { page.set(e.detail); };
    const handleEdit = (e: CustomEvent) => { selectedRow.set(e.detail); confirmAction.set('update'); showConfirm.set(true); };
    const handleDelete = (e: CustomEvent) => { selectedRow.set(e.detail); confirmAction.set('delete'); showConfirm.set(true); };

    const onConfirm = async () => {
        const row = get(selectedRow);
        const action = get(confirmAction);
        if (!row) return;

        if (action === 'update') {
            goto(`${editUrlPrefix}${row.id}`);
        } else if (action === 'delete') {
            try {
                const formData = new URLSearchParams();
                formData.append('id', row.id);
                const res = await fetch(deleteUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                });
                if (res.ok) {
                    rows.update(r => r.filter(x => x.id !== row.id));
                    toast.success('Deleted successfully', { duration: 3000 });
                } else toast.error('Gagal menghapus data');
            } catch {
                toast.error('Terjadi kesalahan koneksi');
            }
        }

        showConfirm.set(false);
        confirmAction.set(null);
        selectedRow.set(null);
    };

    // --- onMount untuk load server/localStorage ---
    if (storageKey) {
        onMount(async () => {
            let serverData: DataTableRow[] = [];
            if (fetchServerData) {
                try {
                    serverData = await fetchServerData();
                } catch {
                    serverData = [];
                }
            }
            syncRows(serverData.length ? serverData : initialRows, rows, storageKey);
        });
    }

    return {
        rows,
        search,
        month,
        year,
        page,
        pageSize,
        showConfirm,
        confirmAction,
        selectedRow,
        total,
        paginatedRows,
        handleSearch,
        handleFilterMonth,
        handleFilterYear,
        handlePaginate,
        handleEdit,
        handleDelete,
        onConfirm
    };
}
