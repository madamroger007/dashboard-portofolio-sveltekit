import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import crypto from 'crypto';
import * as authService from '$lib/server/service/authService';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}

	// generate csrf token
	const csrfToken = crypto.randomBytes(32).toString('hex');
	event.cookies.set('csrf_token', csrfToken, {
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		path: '/'
	});

	return { csrfToken };
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const token = formData.get('csrf_token');

		const csrfCookie = event.cookies.get('csrf_token');
		if (!csrfCookie || token !== csrfCookie) {
			return fail(400, { message: 'CSRF validation failed' });
		}

		return authService.loginService(event, username, password);
	}
};
