import { accountSchema } from './form/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/service/authService';
import * as userRepository from '$lib/server/repositories/userRepository';
export const load: PageServerLoad = async ({ url }) => {
  const data = await userRepository.getUserAll();
  return { accounts: data };
 
};

export const actions: Actions = {
  delete: async (event) => {
    const id = event.url.searchParams.get('id');
    if (id) {
      await userRepository.deleteUser(id);
    }
    throw redirect(303, '/dashboard/access-login/account');
  }
};
