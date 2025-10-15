<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	export let form: ActionData;
	export let data: PageData;
	const { iconProjects, isEdit } = data;

	let file: File | null = null;
	let previewUrl: string | null = null;

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const selectedFile = input.files?.[0];
		if (selectedFile && selectedFile.type.startsWith('image/')) {
			file = selectedFile;
			previewUrl = URL.createObjectURL(selectedFile);
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const droppedFile = e.dataTransfer?.files?.[0];
		if (droppedFile && droppedFile.type.startsWith('image/')) {
			file = droppedFile;
			previewUrl = URL.createObjectURL(droppedFile);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function removeImage() {
		file = null;
		previewUrl = null;
		const input = document.getElementById('file_image') as HTMLInputElement;
		if (input) input.value = '';
	}

	onMount(() => {
		if (isEdit && iconProjects?.url) {
			previewUrl = iconProjects.url; // tampilkan gambar lama kalau sedang edit
		}
	});
</script>

<div class="p-4 md:p-8">
	<h2 class="text-lg font-semibold text-foreground md:text-xl">
		{isEdit ? 'Edit Icon Project' : 'Add New Icon Project'}
	</h2>
	<p class="mb-6 text-sm text-muted-foreground md:text-base">
		{isEdit
			? 'Update your dashboard icon project information and settings.'
			: 'Manage your dashboard icon project information and settings.'}
	</p>

	<form
		use:enhance
		method="POST"
		enctype="multipart/form-data"
		action="?/saveData"
		class="grid grid-cols-1 gap-6 rounded-2xl bg-[var(--sub-background)] p-6 shadow-md md:grid-cols-2"
	>
		{#if isEdit}
			<input type="hidden" name="id" value={iconProjects.id} />
			<input type="hidden" name="publicId" value={iconProjects.publicId} />
		{/if}

		<!-- title -->
		<div class="flex flex-col">
			<label for="name" class="mb-1 text-sm text-muted-foreground">Title</label>
			<input
				type="text"
				name="name"
				value={iconProjects.name}
				placeholder="Name icon project"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- File Image -->
		<div class="flex flex-col">
			<label for="file_image" class="mb-1 text-sm text-muted-foreground">File Image</label>

			<!-- Drop zone -->
			<div
				class="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-500/10 bg-transparent p-6 text-center transition hover:border-primary"
				role="button"
				tabindex="0"
				aria-label="Upload image"
				on:drop={handleDrop}
				on:dragover={handleDragOver}
				on:click={() => document.getElementById('file_image')?.click()}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						document.getElementById('file_image')?.click();
					}
				}}
			>
				{#if previewUrl}
					<img src={previewUrl} alt="Preview" class="h-40 w-auto rounded-md object-contain" />
					<button
						type="button"
						on:click={removeImage}
						class="mt-3 text-sm text-red-500 transition hover:text-red-400"
					>
						Hapus Gambar
					</button>
				{:else}
					<p class="text-sm text-gray-400">
						Drag & drop image here or <span class="text-primary">browse</span>
					</p>
				{/if}
				<input
					id="image"
					type="file"
					name="image"
					accept="image/*"
					on:change={handleFileChange}
					class="absolute inset-0 cursor-pointer opacity-0"
					{...isEdit ? {} : { required: true }}
				/>
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
