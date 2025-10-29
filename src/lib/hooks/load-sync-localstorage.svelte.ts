import type { DataTableRow } from '$lib/components/DataTable.svelte';
import { writable, type Writable } from 'svelte/store';

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

    const isSame = JSON.stringify(cachedData) === JSON.stringify(serverData);

    if (!isSame) {
        rows.set(serverData.map(r => ({ ...r })));
        localStorage.setItem(storageKey, JSON.stringify(serverData));
    } else {
        rows.set(cachedData.map(r => ({ ...r })));
    }
}
