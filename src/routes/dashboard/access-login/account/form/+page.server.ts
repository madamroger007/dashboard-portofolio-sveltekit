import { createAccountSchema, updateAccountSchema } from '$lib/types/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/service/authService';
import * as userRepository from '$lib/server/repositories/userRepository';
import { updateAccountService } from '$lib/server/service/authService';
export const load: PageServerLoad = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (id) {
    // ambil dari DB
    const account = await userRepository.getUserByIdRepository(id);
    if (!account) {
      throw redirect(404, '/dashboard/access-login/account');
    }
    return {
      account: { id: account.id, username: account.username, email: account.email, role: account.role }, isEdit: true
    };
  }
  return {
    account: { username: '', email: '', role: '', password: '', confirmPassword: '' },
    isEdit: false
  };
};

export const actions: Actions = {
  saveData: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const id = formData.id as string | undefined;
    const schema = updateAccountSchema;
    const result = schema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.issues.map((error) => ({
        field: error.path[0],
        message: error.message
      }));
      return fail(400, { error: true, errors });
    }

    if (id) {
      await updateAccountService(event, result.data, id);
    } else {
      await authService.registerService(
        event,
        result.data.username,
        result.data.password!, // create wajib isi
        result.data.role,
        result.data.email
      );
    }

  }
};
