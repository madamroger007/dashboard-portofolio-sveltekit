import { createAccountSchema, updateAccountSchema } from '$lib/validation/account-schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as authService from '$lib/server/service/authService';
import { type User, type TokenUser } from '$lib/server/db/schemaAuth';

export const load: PageServerLoad = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (id) {
    const users = await authService.getUserByIdService(id);
    const account: User | null = users === undefined ? null : users as User;
    const tokens = await authService.getTokenByUserIdService(id);
    const token = tokens === undefined ? { token: '' } : tokens as TokenUser;
    if (!account) {
      throw redirect(404, '/dashboard/access-login/account');
    }
    return {
      account: { id: account.id, username: account.username, email: account.email, role: account.role }, tokens: { token: token.token }, isEdit: true
    };
  }
  return {
    account: { username: '', email: '', role: '', password: '', confirmPassword: '' },
    tokens: { token: '' },
    isEdit: false
  };
};

export const actions: Actions = {
  saveData: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const id = formData.id as string | undefined;

    const schema = id ? updateAccountSchema : createAccountSchema;
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message
      }));
      return fail(400, { error: true, errors });
    }

    const response = id
      ? await authService.updateAccountService(event, parsed.data, id)
      : await authService.registerService(
        event,
        parsed.data.username,
        parsed.data.password!,
        parsed.data.role,
        parsed.data.email
      );

    if (response.status !== 200) {
      return response;
    }

    throw redirect(302, '/dashboard/access-login/account');
  },

  create_token: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const id = formData.id as string;
    if (!id) {
      return fail(400, { error: true, message: 'ID is required' });
    }
    const response = await authService.createTokenService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/access-login/account');
  },
  update_token: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const id = formData.id as string;
    const response = await authService.updateTokenService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/access-login/account');
  }
};
