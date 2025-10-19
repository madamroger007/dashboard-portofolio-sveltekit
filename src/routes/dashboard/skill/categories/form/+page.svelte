<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	export let form: ActionData;
	export let data: PageData;
	const { category_skill, isEdit } = data;
</script>

<div class="p-4 md:p-8">
	<h2 class="text-lg font-semibold text-foreground md:text-xl">
		{isEdit ? 'Edit Category Skill' : 'Add New Category Skill'}
	</h2>
	<p class="mb-6 text-sm text-muted-foreground md:text-base">
		{isEdit
			? 'Update your dashboard category skill information and settings.'
			: 'Manage your dashboard category skill information and settings.'}
	</p>

	<form
		use:enhance
		method="POST"
		action="?/saveData"
		class="grid grid-cols-1 gap-6 rounded-2xl bg-[var(--sub-background)] p-6 shadow-md md:grid-cols-2"
	>
		{#if isEdit}
			<input type="hidden" name="id" value={category_skill.id} />
		{/if}
		<!-- title -->
		<div class="flex flex-col">
			<label for="title" class="mb-1 text-sm text-muted-foreground">Title</label>
			<input
				type="text"
				name="title"
				value={category_skill.title}
				placeholder="Category Skill Title"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- Error Messages -->
		{#if form?.error}
			<div class="md:col-span-2">
				<ul class="list-disc space-y-1 pl-5 text-sm text-red-400">
					{#each form.errors as error}
						<li>{error.field}: {error.message}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Submit -->
		<div class="md:col-span-2">
			<Button type="submit">
				{isEdit ? 'Update Category Project' : 'Create Category Project'}
			</Button>
		</div>
	</form>
</div>
