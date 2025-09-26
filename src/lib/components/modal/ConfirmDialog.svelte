<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	export let open = false;
	export let title = '';
	export let description = '';
	export let confirmText = 'OK';
	export let variant: 'default' | 'destructive' = 'default';

	const dispatch = createEventDispatcher();
	$: if (!open) {
		dispatch('cancel'); // otomatis trigger cancel saat modal ditutup
	}
	function confirm() {
		dispatch('confirm');
	}

	function cancel() {
		open = false;
		dispatch('cancel');
	}
</script>

<Dialog bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>{title}</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
		</DialogHeader>
		<DialogFooter class="mt-4">
			<Button variant="secondary" onclick={cancel}>Cancel</Button>
			<Button {variant} onclick={confirm}>{confirmText}</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
