import FlaskConical from '@lucide/svelte/icons/flask-conical';
import UsersIcon from '@lucide/svelte/icons/users';
import InboxIcon from '@lucide/svelte/icons/inbox';
import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
import BookCheck from '@lucide/svelte/icons/book-check';
import Images from '@lucide/svelte/icons/images';

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
        icon: BookmarkCheck,
        children: [
            { title: 'Project', url: '/dashboard/project' },
            { title: 'Categories Project', url: '/dashboard/project/categories' }
        ]
    },
    {
        title: 'Icons',
        icon: Images,
        url: '/dashboard/icons'
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
