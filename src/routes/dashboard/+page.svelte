<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import StatCard from '$lib/components/ui/custom-card/stats-card.svelte';
	export let data: PageData;
	const { totalCertifs, totalExperiences, totalProjects, totalSkills, totalUsers } = data;
</script>

<div class="flex min-h-screen">
	<main class="flex-1 overflow-y-auto p-6">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			<StatCard title="User" value={totalUsers} change="" icon="👥" positive={true} />
			<StatCard
				title="Experience"
				value={totalExperiences}
				change=""
				icon="💜"
				positive={true}
			/>
			<StatCard title="Skill" value={totalSkills} change="" icon="⚡" positive={false} />
			<StatCard title="Project" value={totalProjects} change="" icon="📦" positive={true} />
			<StatCard
				title="Certification"
				value={totalCertifs}
				change=""
				icon="🎓"
				positive={true}
			/>
		</div>
	</main>
</div>
