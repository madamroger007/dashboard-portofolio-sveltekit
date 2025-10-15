import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as iconProjectService from '$lib/server/service/project/iconsProjectService';
import * as iconProjectRepository from '$lib/server/repositories/project/iconsProjectRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await iconProjectRepository.getAllIconProjectRepository();
  return { getData: data };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    const response = await iconProjectService.deleteIconProjectService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/project/icons');
  }
};
