import { writable } from 'svelte/store';

/**
 * Hook untuk menyalin teks ke clipboard dengan status reaktif.
 * Bisa digunakan di SvelteKit dengan `$copied`.
 */
export function useClipboard() {
	const copied = writable(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	async function copy(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied.set(true);

			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => copied.set(false), 3000);
		} catch (error) {
			console.error('Clipboard copy failed:', error);
			copied.set(false);
		}
	}

	return { copied, copy };
}
