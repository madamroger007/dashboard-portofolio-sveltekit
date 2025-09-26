import type { DataTableRow } from '$lib/components/DataTable.svelte';
import { writable, type Writable } from 'svelte/store';

/**
 * syncRows
 * Sinkronisasi data server ke store dan localStorage
 * @param serverData - data terbaru dari server
 * @param rows - store Writable<DataTableRow[]> yang ingin di-update
 * @param storageKey - key untuk localStorage
 */
export default function syncRows(
    serverData: DataTableRow[],
    rows: Writable<DataTableRow[]>,
    storageKey: string
) {
    const cached = localStorage.getItem(storageKey);
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
        // update rows store dengan data baru
        rows.set(serverData.map(r => ({ ...r })));
        // simpan ke localStorage
        localStorage.setItem(storageKey, JSON.stringify(serverData));
    } else {
        // gunakan data dari cache
        rows.set(cachedData.map(r => ({ ...r })));
    }
}
