<script lang="ts">
	import { goto } from '$app/navigation';

	function goToDashboard() {
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 text-white"
>
	<div class="max-w-2xl text-center">
		<h1 class="mb-6 text-5xl font-extrabold md:text-6xl">
			Welcome to <span class="text-yellow-300">Portofolio Dashboard</span>
		</h1>
		<p class="mb-10 text-lg text-gray-100 md:text-xl">
			Manage your portfolio easily, quickly, and organized.
		</p>

		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button
				on:click={goToDashboard}
				class="cursor-pointer rounded-2xl bg-yellow-400 px-8 py-3 font-semibold text-indigo-900 shadow-lg transition hover:bg-yellow-300"
			>
				Open Dashboard
			</button>

			<a
				href="#fitur"
				class="rounded-2xl bg-white/20 px-8 py-3 font-semibold shadow-lg backdrop-blur-md transition hover:bg-white/30"
			>
				View Features
			</a>
		</div>
	</div>
</section>

<!-- Section fitur -->
<section id="fitur" class="bg-white py-20 text-gray-800">
	<div class="mx-auto max-w-5xl px-6 text-center">
		<h2 class="mb-10 text-3xl font-bold md:text-4xl">Main Features</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="rounded-2xl border p-6 shadow-md">
				<h3 class="mb-2 text-xl font-semibold">📊 Data Analysis</h3>
				<p class="text-gray-600">Monitor your portfolio's progress with interactive charts.</p>
			</div>
			<div class="rounded-2xl border p-6 shadow-md">
				<h3 class="mb-2 text-xl font-semibold">🔒 Security</h3>
				<p class="text-gray-600">Login protection with modern authentication and OTP.</p>
			</div>
			<div class="rounded-2xl border p-6 shadow-md">
				<h3 class="mb-2 text-xl font-semibold">⚡ Performance</h3>
				<p class="text-gray-600">Fast and lightweight access with the latest technology.</p>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-gray-900 py-6 text-center text-sm text-gray-400">
	&copy; {new Date().getFullYear()} Portofolio Dashboard. Created with ❤️ using SvelteKit.
</footer>
