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
<!-- Container -->
<section
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 text-white"
>
	<div class="max-w-2xl text-center">
		<h1 class="mb-6 text-5xl font-extrabold md:text-6xl">
			Selamat Datang di <span class="text-yellow-300">Portofolio Dashboard</span>
		</h1>
		<p class="mb-10 text-lg text-gray-100 md:text-xl">
			Kelola portofolio Anda dengan mudah, cepat, dan terorganisir.
		</p>

		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button
				on:click={goToDashboard}
				class="cursor-pointer rounded-2xl bg-yellow-400 px-8 py-3 font-semibold text-indigo-900 shadow-lg transition hover:bg-yellow-300"
			>
				Masuk Dashboard
			</button>

			<a
				href="#fitur"
				class="rounded-2xl bg-white/20 px-8 py-3 font-semibold shadow-lg backdrop-blur-md transition hover:bg-white/30"
			>
				Lihat Fitur
			</a>
		</div>
	</div>
</section>

<!-- Section fitur -->
<section id="fitur" class="bg-white py-20 text-gray-800">
	<div class="mx-auto max-w-5xl px-6 text-center">
		<h2 class="mb-10 text-3xl font-bold md:text-4xl">Fitur Utama</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="rounded-2xl border p-6 shadow-md">
				<h3 class="mb-2 text-xl font-semibold">📊 Analisis Data</h3>
				<p class="text-gray-600">Pantau perkembangan portofolio Anda dengan grafik interaktif.</p>
			</div>
			<div class="rounded-2xl border p-6 shadow-md">
				<h3 class="mb-2 text-xl font-semibold">🔒 Keamanan</h3>
				<p class="text-gray-600">Proteksi login dengan autentikasi modern dan OTP.</p>
			</div>
			<div class="rounded-2xl border p-6 shadow-md">
				<h3 class="mb-2 text-xl font-semibold">⚡ Performa</h3>
				<p class="text-gray-600">Akses cepat dan ringan dengan teknologi terbaru.</p>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-gray-900 py-6 text-center text-sm text-gray-400">
	&copy; {new Date().getFullYear()} Portofolio Dashboard. Dibuat dengan ❤️ menggunakan SvelteKit.
</footer>
