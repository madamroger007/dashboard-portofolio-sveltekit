import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as skillService from '$lib/server/service/skill/skillService';
import * as skillRepository from '$lib/server/repositories/skill/skillRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await skillRepository.getAllSkillsRepository();

  const flattened = data.map((item) => ({
    id: item.id,
    title: item.title,
    categoryTitle: item.category?.title ?? '-',
    icons: item.icons?.map((i: any) => i.url) ?? [],
    createdAt: new Date(item.createdAt).toLocaleString(),
    updatedAt: new Date(item.updatedAt).toLocaleString()
  }));
  return { getData: flattened };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    const response = await skillService.deleteSkillService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/skill');
  }
};
