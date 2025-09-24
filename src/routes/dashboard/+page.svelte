<script lang="ts">
	import StatCard from '$lib/components/ui/custom-card/stats-card.svelte';
</script>


<div class="flex min-h-screen ">
	<!-- Main content -->
	<main class="flex-1 overflow-y-auto p-6">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			<StatCard title="Experience" value="50.8K" change="+28.4%" icon="💜" positive={true} />
			<StatCard title="Skill" value="23.6K" change="-12.6%" icon="⚡" positive={false} />
			<StatCard title="Project" value="756" change="+3.1%" icon="📦" positive={true} />
			<StatCard title="Certification" value="2.3K" change="+11.3%" icon="🎓" positive={true} />
			<StatCard title="Roles" value="50.8K" change="+28.4%" icon="👥" positive={true} />
		</div>
	</main>
</div>
