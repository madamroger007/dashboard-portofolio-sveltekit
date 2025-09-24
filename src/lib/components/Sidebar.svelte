<script lang="ts">
	import { page } from '$app/stores';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';
	import UsersIcon from '@lucide/svelte/icons/users';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import BookCheck from '@lucide/svelte/icons/book-check';
	import CircleUser from '@lucide/svelte/icons/circle-user';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	type MenuItem = {
		title: string;
		url?: string;
		icon?: any;
		children?: MenuItem[];
	};

	const items: MenuItem[] = [
		{
			title: 'Dashboard',
			icon: InboxIcon,
			url: '/dashboard'
		},
		{
			title: 'Access Login',
			icon: UsersIcon,
			children: [
				{ title: 'Data Account', url: '/dashboard/access-login/account' },
				{ title: 'Roles', url: '/dashboard/access-login/roles' }
			]
		},
		{
			title: 'Certification',
			icon: InboxIcon,
			url: '/dashboard/certification'
		},
		{
			title: 'Experience',
			icon: FlaskConical,
			children: [
				{ title: 'Experience', url: '/dashboard/experience' },
				{ title: 'Categories Experience', url: '/dashboard/experience/categories' }
			]
		},
		{
			title: 'Project',
			icon: FlaskConical,
			children: [
				{ title: 'Project', url: '/dashboard/project' },
				{ title: 'Categories Project', url: '/dashboard/project/advanced' }
			]
		},
		{
			title: 'Skill',
			icon: BookCheck,
			children: [
				{ title: 'Skill', url: '/dashboard/skill' },
				{ title: 'Categories Skill', url: '/dashboard/skill/categories' }
			]
		},
		{
			title: 'Account Data',
			icon: CircleUser,
			children: [{ title: 'Logout', url: '/logout' }]
		}
	];

	let openMenus: Record<string, boolean> = {};

	function toggleMenu(title: string) {
		openMenus = { ...openMenus, [title]: !openMenus[title] };
	}

	function isActive(url?: string) {
		if (!url) return false;
		const current = $page.url.pathname; // gunakan $page, biar reaktif
		return current === url || current.startsWith(url + '/dashboard');
	}

	function isParentActive(item: MenuItem) {
		if (!item.children) return false;
		return item.children.some((child) => isActive(child.url));
	}
</script>

<Sidebar.Root class="w-64 border-r ">
	<Sidebar.Content class="flex h-screen flex-col bg-sub2-background">
		<Sidebar.Group>
			<Sidebar.GroupLabel
				class="px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
			>
				Application
			</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							{#if item.children}
								<!-- Menu dengan submenu -->
								<Sidebar.MenuButton class="py-5">
									{#snippet child({ props })}
										<button
											class="flex w-full items-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
											on:click={() => toggleMenu(item.title)}
											{...props}
										>
											<div class="flex flex-1 items-center gap-2">
												{#if item.icon}
													<item.icon class="h-5 w-5 text-muted-foreground " />
												{/if}
												<span
													class="font-medium transition-colors duration-200"
													class:text-gray-500={!isParentActive(item)}
													class:dark:text-[#A0A3CC]={!isParentActive(item)}
												>
													{item.title}
												</span>
											</div>
											<ChevronDown
												class={`h-4 w-4 text-muted-foreground transition-transform ml-auto${openMenus[item.title] ? ' rotate-180' : ''}`}
											/>
										</button>
									{/snippet}
								</Sidebar.MenuButton>

								{#if openMenus[item.title]}
									<div class="mt-1 ml-6 flex flex-col gap-1 border-l border-muted pl-3">
										{#each item.children as child}
											<a
												href={child.url}
												class="rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
												class:bg-accent={isActive(child.url)}
												class:text-accent-foreground={isActive(child.url)}
												class:text-gray-500={!isActive(child.url)}
												class:dark:text-[#A0A3CC]={!isActive(child.url)}
											>
												{child.title}
											</a>
										{/each}
									</div>
								{/if}
							{:else}
								<!-- Menu biasa -->
								<Sidebar.MenuButton class="py-5 hover:cursor-pointer">
									{#snippet child({ props })}
										<a
											href={item.url}
											class="flex items-center gap-2 rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
											class:bg-accent={isActive(item.url)}
											class:text-accent-foreground={isActive(item.url)}
											{...props}
										>
											{#if item.icon}
												<item.icon class="h-6 w-6 text-muted-foreground " />
											{/if}
											<span
												class="font-medium transition-colors duration-200"
												class:text-gray-500={!isActive(item.url)}
												class:dark:text-[#A0A3CC]={!isActive(item.url)}
											>
												{item.title}
											</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							{/if}
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
