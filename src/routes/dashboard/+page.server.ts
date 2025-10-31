import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { PageServerLoad } from './$types';
import { getAllUsersService } from '$lib/server/service/authService';
import { getAllSkillsService } from '$lib/server/service/skill/skillService';
import { getAllProjectService } from '$lib/server/service/project/projectService';
import { getAllExperienceService } from '$lib/server/service/experience/experientService';
import { getCertifAllService } from '$lib/server/service/certifService'

export const load: PageServerLoad = async () => {
    const user = requireLogin();
    const [
        users,
        skills,
        projects,
        experiences,
        certifs
    ] = await Promise.all([
        getAllUsersService(),
        getAllSkillsService(),
        getAllProjectService(),
        getAllExperienceService(),
        getCertifAllService()
    ]);
    const count = (data: unknown) => (Array.isArray(data) ? data.length : 0);

    return {
        user,
        totalUsers: count(users),
        totalSkills: count(skills),
        totalProjects: count(projects),
        totalExperiences: count(experiences),
        totalCertifs: count(certifs)
    };
};

function requireLogin() {
    const { locals } = getRequestEvent();
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    return locals.user;
}
