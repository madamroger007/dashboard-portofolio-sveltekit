import { accountSchema } from './schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/service/authService';
import * as userRepository from '$lib/server/repositories/userRepository';
export const load: PageServerLoad = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (id) {
    // ambil dari DB
    const account = await userRepository.getUserById(id);
    if (!account) {
      throw redirect(404, '/dashboard/access-login/account');
    }
    return { account, isEdit: true };
  }
  return {
    account: { username: '', email: '', role: '', password: '', confirmPassword: '' },
    isEdit: false
  };
};

export const actions: Actions = {
  register: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const result = accountSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.issues.map((error) => ({
        field: error.path[0],
        message: error.message
      }));
      return fail(400, { error: true, errors });
    }

    const id = event.url.searchParams.get('id');
    if (id) {
      console.log('Update account', id, result.data);
    } else {
      authService.register(event, result.data.username, result.data.password, result.data.role, result.data.email);
    }

    throw redirect(303, '/dashboard/access-login/account');
  },
  delete: async (event) => {
    const id = event.url.searchParams.get('id');
    if (id) {
      await userRepository.deleteUser(id);
    }
    throw redirect(303, '/dashboard/access-login/account');
  }
};
