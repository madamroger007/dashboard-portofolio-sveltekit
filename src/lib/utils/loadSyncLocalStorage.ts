import DataTable, { type TableColumn, type DataTableRow } from '$lib/components/DataTable.svelte';
export default function syncRows(serverData: DataTableRow[], rows: DataTableRow[], name: string) {
    const cached = localStorage.getItem(name);
    let cachedData: DataTableRow[] = [];

    if (cached) {
        try {
            cachedData = JSON.parse(cached);
        } catch {
            cachedData = [];
        }
    }

    // cek apakah ada data baru dari server
    const isSame = JSON.stringify(cachedData) === JSON.stringify(serverData);

    if (!isSame) {
        // update rows dengan data baru
        rows = serverData.map((r) => ({
            ...r
        }));
        // simpan ke localStorage
        localStorage.setItem(name, JSON.stringify(rows));
    } else {
        // gunakan data dari cache
        rows = cachedData.map((r) => ({
            ...r
        }));
    }
}