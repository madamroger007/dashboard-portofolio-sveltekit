<script lang="ts">
	export let title: string;
	export let value: string | number;
	export let change: string; // e.g. "+28.4%"
	export let icon: string = '💜'; // default icon
	export let positive: boolean = true;
</script>

<div class="flex w-56 flex-col rounded-xl bg-slate-100 p-4 shadow-md dark:bg-slate-800">
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-2 text-purple-400">
			<span>{icon}</span>
			<span class="text-sm font-medium">{title}</span>
		</div>
		<button class="text-gray-800 hover:text-white dark:text-gray-400">•••</button>
	</div>
	<div class="mt-4 text-2xl font-bold text-gray-600 dark:text-white">{value}</div>
	<div class={`mt-2 text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
		{change}
	</div>
</div>
