<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import Logout from '@lucide/svelte/icons/log-out';
</script>

<form action="?/logout" use:enhance method="POST">
	<Button
		variant="link"
		size="icon"
		class="rounded-2 size-8 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/20"
		type="submit"
	>
		<Logout />
	</Button>
</form>
