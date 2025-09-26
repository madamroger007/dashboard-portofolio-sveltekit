import { createAccountSchema, updateAccountSchema } from '$lib/validation/account-schema';
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

    // Pilih schema sesuai mode
    const schema = id ? updateAccountSchema : createAccountSchema;
    const parsed = schema.safeParse(formData);

    // Validasi gagal
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message
      }));
      return fail(400, { error: true, errors });
    }

    // Eksekusi aksi
    const response = id
      ? await updateAccountService(event, parsed.data, id)
      : await authService.registerService(
        event,
        parsed.data.username,
        parsed.data.password!, // create wajib isi
        parsed.data.role,
        parsed.data.email
      );

    // Gagal → balikin response
    if (response.status !== 200) {
      return response;
    }

    // Sukses → redirect
    throw redirect(302, '/dashboard/access-login/account');
  }
};
