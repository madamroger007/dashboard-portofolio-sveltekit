<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { useClipboard } from '$lib/hooks/use-clipboard.svelte';
	export let form: ActionData;
	export let data: PageData;
	const { account, tokens, isEdit } = data;
	const { copied, copy } = useClipboard();
</script>

<div class="p-4 md:p-8">
	<h2 class="text-lg font-semibold text-foreground md:text-xl">
		{isEdit ? 'Edit Account' : 'Add New Account'}
	</h2>
	<p class="mb-6 text-sm text-muted-foreground md:text-base">
		{isEdit
			? 'Update your dashboard account information and settings.'
			: 'Manage your dashboard account information and settings.'}
	</p>

	{#if isEdit}
		<div class="grid grid-rows-2 justify-end gap-5 md:flex">
			<InputGroup.Root class="mb-5">
				<InputGroup.Input
					type="password"
					value={tokens?.token}
					readonly
					class="text-muted-foreground"
				/>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copy(tokens?.token)}
					>
						{#if $copied}
							<CheckIcon class="text-green-500 transition-all duration-200" />
						{:else}
							<CopyIcon class="text-muted-foreground transition-all duration-200" />
						{/if}
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<div class="mb-5 flex gap-5">
				<form method="post">
					<input type="hidden" name="id" value={account.id} />
					<Button type="submit" formaction="?/create_token">New Token API</Button>
				</form>

				<form method="post">
					<input type="hidden" name="id" value={account.id} />
					<Button type="submit" formaction="?/update_token">Update Token API</Button>
				</form>
			</div>
		</div>
	{/if}

	<form
		use:enhance
		method="POST"
		action="?/saveData"
		class="grid grid-cols-1 gap-6 rounded-2xl bg-[var(--sub-background)] p-6 shadow-md md:grid-cols-2"
	>
		{#if isEdit}
			<input type="hidden" name="id" value={account.id} />
		{/if}
		<!-- Username -->
		<div class="flex flex-col">
			<label for="username" class="mb-1 text-sm text-muted-foreground">Username</label>
			<input
				type="text"
				name="username"
				value={account.username}
				placeholder="John Carter"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- Email -->
		<div class="flex flex-col">
			<label for="email" class="mb-1 text-sm text-muted-foreground">Email</label>
			<input
				type="email"
				name="email"
				value={account.email}
				placeholder="you@example.com"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				required
			/>
		</div>

		<!-- Password -->
		<div class="flex flex-col">
			<label for="password" class="mb-1 text-sm text-muted-foreground">Password</label>
			<input
				type="password"
				name="password"
				placeholder="********"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				{...!isEdit ? { required: true } : {}}
			/>
			{#if isEdit}
				<small class="mt-1 text-xs text-muted-foreground"
					>Leave blank to keep the same password.</small
				>
			{/if}
		</div>

		<!-- Confirm Password -->
		<div class="flex flex-col">
			<label for="confirmPassword" class="mb-1 text-sm text-muted-foreground"
				>Confirm Password</label
			>
			<input
				type="password"
				name="confirmPassword"
				placeholder="********"
				class="border-b border-border bg-transparent py-2 text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
				{...!isEdit ? { required: true } : {}}
			/>
		</div>

		<!-- Role -->
		<div class="flex flex-col md:col-span-2 lg:col-span-1">
			<label for="role" class="mb-1 text-sm text-muted-foreground">Role</label>
			<select
				name="role"
				class="border-b border-border bg-transparent py-2 text-gray-500 focus:border-primary focus:outline-none"
				required
			>
				<option value="" disabled selected>-- Pilih Role --</option>
				<option value="Admin" selected={account.role === 'Admin'}> Admin </option>
				<option value="Management" selected={account.role === 'Management'}> Management </option>
				<option value="Staff" selected={account.role === 'Staff'}>Staff</option>
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
				{isEdit ? 'Update Account' : 'Create Account'}
			</Button>
		</div>
	</form>
</div>
