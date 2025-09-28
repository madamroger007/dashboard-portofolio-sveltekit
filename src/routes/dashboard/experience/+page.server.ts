import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as experienceService from '$lib/server/service/experience/experientService';
import * as experienceRepository from '$lib/server/repositories/experience/experienceRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await experienceRepository.getAllExperienceRepository();
  return { getData: data };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    const response = await experienceService.deleteExperienceService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/experience');
  }
};
