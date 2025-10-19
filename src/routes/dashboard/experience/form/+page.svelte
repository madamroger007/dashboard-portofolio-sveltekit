<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	export let form: ActionData;
	export let data: PageData;
	const { experience, isEdit, categories } = data;
</script>

<div class="p-4 md:p-8">
	<h2 class="text-lg font-semibold text-foreground md:text-xl">
		{isEdit ? 'Edit Experience' : 'Add New Experience'}
	</h2>
	<p class="mb-6 text-sm text-muted-foreground md:text-base">
		{isEdit
			? 'Update your dashboard experience information and settings.'
			: 'Manage your dashboard experience information and settings.'}
	</p>

	<form
		use:enhance
		method="POST"
		action="?/saveData"
		class="grid grid-cols-1 gap-6 rounded-2xl bg-[var(--sub-background)] p-6 shadow-md md:grid-cols-2"
	>
		{#if isEdit}
			<input type="hidden" name="id" value={experience.id} />
		{/if}
		<!-- title -->
		<div class="flex flex-col">
			<label for="title" class="mb-1 text-sm text-muted-foreground">Title</label>
			<input
				type="text"
				name="title"
				value={experience.title}
				placeholder="Experience Title"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- name institution -->
		<div class="flex flex-col">
			<label for="name_institution" class="mb-1 text-sm text-muted-foreground"
				>Name Institution</label
			>
			<input
				type="text"
				name="name_institution"
				value={experience.name_institution}
				placeholder="Name Institution"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- description -->
		<div class="flex flex-col">
			<label for="description" class="mb-1 text-sm text-muted-foreground">Description</label>
			<textarea
				name="description"
				value={experience.description}
				placeholder="Description..."
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			></textarea>
		</div>

		<!-- time_start -->
		<div class="flex flex-col">
			<label for="time_start" class="mb-1 text-sm text-muted-foreground">Time Start</label>
			<input
				type="date"
				id="time_start"
				name="time_start"
				bind:value={experience.time_start}
				placeholder="Time Start"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- time_start -->
		<div class="flex flex-col">
			<label for="time_end" class="mb-1 text-sm text-muted-foreground">Time end</label>
			<input
				type="date"
				id="time_end"
				name="time_end"
				bind:value={experience.time_end}
				placeholder="Time End"
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
				{isEdit ? 'Update Certificate' : 'Create Certificate'}
			</Button>
		</div>
	</form>
</div>
