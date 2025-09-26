<script lang="ts">
	import { enhance } from '$app/forms';
	import Logout from '@lucide/svelte/icons/log-out';
	import {
		Tooltip,
		TooltipTrigger,
		TooltipContent,
		TooltipProvider
	} from '$lib/components/ui/tooltip';
</script>

<form action="?/logout" use:enhance method="POST">
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger
				type="submit"
				class="rounded-2 size-4.5 cursor-pointer "
			>
				<Logout class="w-6 h-6" />
			</TooltipTrigger>
			<TooltipContent>Logout</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</form>
