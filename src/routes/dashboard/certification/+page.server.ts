import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as certifService from '$lib/server/service/certifService';
import * as certifRepository from '$lib/server/repositories/certifRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await certifRepository.getCertiAllfRepository();
  return { getData: data };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    const response = await certifService.deleteCertifService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/certification');
  }
};
