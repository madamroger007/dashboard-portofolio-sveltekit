import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as iconService from '$lib/server/service/iconsService';
import * as iconRepository from '$lib/server/repositories/iconsRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await iconRepository.getAllIconRepository();
  return { getData: data };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    const response = await iconService.deleteIconService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/icons');
  }
};
