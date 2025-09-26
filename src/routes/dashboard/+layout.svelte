<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/Sidebar.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	export let children;
</script>

<Sidebar.Provider>
	<AppSidebar />

	<main class="min-h-screen w-full bg-background text-foreground">
		<TopBar />
		<div class="p-4">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>
