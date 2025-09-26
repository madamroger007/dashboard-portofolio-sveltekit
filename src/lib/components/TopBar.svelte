<script lang="ts">
	import ThemeButton from '$lib/components/ThemeButton.svelte';
	import Logout from '$lib/components/Logout.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
</script>

<!-- Topbar -->
<div
	class="flex items-center justify-between space-x-2 border-b bg-sub2-background
             p-2"
>
	<Sidebar.Trigger />
	<div class="flex items-center justify-center gap-4">
		<Logout />
		<ThemeButton />
	</div>
</div>
