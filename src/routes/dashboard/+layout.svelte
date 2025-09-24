<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/Sidebar.svelte';
	import ThemeButton from '$lib/components/ThemeButton.svelte';
	import Logout from '$lib/components/Logout.svelte';
	export let children;
</script>

<Sidebar.Provider>
	<AppSidebar />

	<main class="min-h-screen w-full bg-background text-foreground">
		<!-- Topbar -->
		<div
			class="flex items-center justify-between space-x-2 border-b bg-sub2-background
             p-2"
		>
			<Sidebar.Trigger />
			<div class="flex items-center space-x-2">
				<Logout />
				<ThemeButton />
			</div>
		</div>

		<div class="p-4">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>
