import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/service/authService';
import * as userRepository from '$lib/server/repositories/userRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await userRepository.getUserAllRepository();
  return { accounts: data };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    await authService.deleteAccountService(event, id);
    throw redirect(303, '/dashboard/access-login/account');
  }
};
