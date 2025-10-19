<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';

	export let form: ActionData;
	export let data: PageData;
	const { skill, isEdit, categories, icons } = data;

</script>

<div class="p-4 md:p-8">
	<h2 class="text-lg font-semibold text-foreground md:text-xl">
		{isEdit ? 'Edit Skill' : 'Add New Skill'}
	</h2>
	<p class="mb-6 text-sm text-muted-foreground md:text-base">
		{isEdit
			? 'Update your dashboard skill information and settings.'
			: 'Manage your dashboard skill information and settings.'}
	</p>

	<form
		use:enhance
		method="POST"
		enctype="multipart/form-data"
		action="?/saveData"
		class="grid grid-cols-1 gap-6 rounded-2xl bg-[var(--sub-background)] p-6 shadow-md md:grid-cols-2"
	>
		{#if isEdit}
			<input type="hidden" name="id" value={skill.skillId} />
		{/if}

		<!-- title -->
		<div class="flex flex-col">
			<label for="name" class="mb-1 text-sm text-muted-foreground">Title</label>
			<input
				type="text"
				name="title"
				value={skill.title}
				placeholder="Name skill"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- Category -->
		<div class="flex flex-col">
			<label for="category_id" class="mb-1 text-sm text-muted-foreground">Category</label>
			<select
				name="category_id"
				class="border-b border-border bg-transparent py-2 text-gray-500 placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			>
				{#each categories as category}
					<option value={category.id}>{category.title}</option>
				{/each}
			</select>
		</div>

		<!-- Icons -->
		<div class="flex flex-col md:col-span-2">
			<label for="iconIds" class="mb-1 text-sm text-muted-foreground">Icons</label>
			<div class="flex flex-wrap gap-3">
				{#each icons as icon}
					<label
						class="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 transition hover:border-primary"
					>
						<input
							type="checkbox"
							name="iconIds"
							value={icon.id}
							checked={isEdit && skill.iconIds?.includes(icon.id)}
						/>
						<img src={icon.url} alt={icon.name} class="h-6 w-6" />
						<span class="text-sm text-foreground">{icon.name}</span>
					</label>
				{/each}
			</div>
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
				{isEdit ? 'Update Icon' : 'Create Icon'}
			</Button>
		</div>
	</form>
</div>

<style>
	img {
		user-select: none;
		pointer-events: none;
	}
</style>
