<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	export let data;
</script>

<section class="flex min-h-screen items-center justify-center p-4">
	<Card
		class="w-full max-w-md bg-gray-200/40 text-gray-500 shadow-lg dark:bg-purple-900 dark:text-gray-300"
	>
		<CardHeader>
			<CardTitle class="text-2xl">Back to your digital life</CardTitle>
			<CardDescription class="text-gray-500 dark:text-gray-300"
				>Choose one of the option to go</CardDescription
			>
		</CardHeader>

		<CardContent>
			{#if form?.message}
				<div class="mb-4 text-sm dark:text-red-400">{form.message}</div>
			{/if}

			<form method="POST" action="?/login" use:enhance class="space-y-4">
				<input type="hidden" name="csrf_token" value={data.csrfToken} />
				<div class="space-y-2">
					<Label for="username" class="dark:text-white">Username</Label>
					<Input
						id="username"
						type="text"
						name="username"
						placeholder="get@ziontutorial.com"
						class="dar:border-purple-400 border-gray-500 bg-transparent placeholder:text-gray-400 dark:text-white"
					/>
				</div>

				<div class="space-y-2">
					<Label for="password" class="dark:text-white">Password</Label>
					<Input
						id="password"
						type="password"
						name="password"
						placeholder="Password"
						class="border-gray-500 bg-transparent placeholder:text-gray-400 dark:border-purple-400 dark:text-white"
					/>
				</div>

				<Button class="w-full bg-white text-purple-900 transition hover:bg-gray-100" type="submit">Log in</Button>
				
			</form>
		</CardContent>
	</Card>
</section>
