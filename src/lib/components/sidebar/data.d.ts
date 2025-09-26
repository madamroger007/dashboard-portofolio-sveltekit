import FlaskConical from '@lucide/svelte/icons/flask-conical';
import UsersIcon from '@lucide/svelte/icons/users';
import InboxIcon from '@lucide/svelte/icons/inbox';
import BookCheck from '@lucide/svelte/icons/book-check';
export type MenuItem = {
    title: string;
    url?: string;
    icon?: any;
    children?: MenuItem[];
};

export const items: MenuItem[] = [
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
    }
];
