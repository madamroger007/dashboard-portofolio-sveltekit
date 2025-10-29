<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	export let form: ActionData;
	export let data: PageData;
	const { certification, isEdit } = data;
</script>

<div class="p-4 md:p-8">
	<h2 class="text-lg font-semibold text-foreground md:text-xl">
		{isEdit ? 'Edit Certificate' : 'Add New Certificate'}
	</h2>
	<p class="mb-6 text-sm text-muted-foreground md:text-base">
		{isEdit
			? 'Update your dashboard certificate information and settings.'
			: 'Manage your dashboard certificate information and settings.'}
	</p>

	<form
		use:enhance
		method="POST"
		action="?/saveData"
		class="grid grid-cols-1 gap-6 rounded-2xl bg-[var(--sub-background)] p-6 shadow-md md:grid-cols-2"
	>
		{#if isEdit}
			<input type="hidden" name="id" value={certification.id} />
		{/if}
		<!-- title -->
		<div class="flex flex-col">
			<label for="title" class="mb-1 text-sm text-muted-foreground">Title</label>
			<input
				type="text"
				name="title"
				value={certification.title}
				placeholder="Certification Title"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- link_cert -->
		<div class="flex flex-col">
			<label for="link_cert" class="mb-1 text-sm text-muted-foreground">Link Certificate</label>
			<input
				type="text"
				name="link_cert"
				value={certification.link_cert}
				placeholder="https://example.com/certification"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- name_institution -->
		<div class="flex flex-col">
			<label for="name_institution" class="mb-1 text-sm text-muted-foreground"
				>Name Institution</label
			>
			<input
				type="text"
				name="name_institution"
				value={certification.name_institution}
				placeholder="Name Institution"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- time_cert -->
		<div class="flex flex-col">
			<label for="time_cert" class="mb-1 text-sm text-muted-foreground">Time Certificate</label>
			<input
				type="date"
				id="time_cert"
				name="time_cert"
				bind:value={certification.time_cert}
				placeholder="Choose date"
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
				{isEdit ? 'Update Certificate' : 'Create Certificate'}
			</Button>
		</div>
	</form>
</div>
