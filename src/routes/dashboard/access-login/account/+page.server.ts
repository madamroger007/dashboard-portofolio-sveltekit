import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/service/authService';
import * as userRepository from '$lib/server/repositories/userRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await userRepository.getUserAllRepository();
  return { getData: data };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const id = formData.id as string | undefined;
    if (!id) {
      return fail(400, { error: true, message: 'ID is required' });
    }
    const response = await authService.deleteAccountService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/access-login/account');
  }
};
