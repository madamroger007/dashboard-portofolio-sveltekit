<script lang="ts">
	import Button from './button.svelte';
	import Spinner from '../spinner/spinner.svelte';

	export let loading: boolean = false;
	export let disabled: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let formaction: string | undefined = undefined;
	export let variant:
		| 'link'
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| undefined = 'default';
	export let size: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg' = 'default';
	export let loadingText: string = 'Loading...';
	export let text: string = 'Submit';
	export let className: string = '';
</script>

<Button {type} {formaction} {variant} {size} class={className} disabled={loading || disabled}>
	{#if loading}
		<Spinner class="mr-2 h-4 w-4 text-black" />
		{loadingText}
	{:else}
		{text}
	{/if}
</Button>
