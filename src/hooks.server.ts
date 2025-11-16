import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const allowedOrigins = [
	'https://adamstd.my.id',
	'https://www.adamstd.my.id',
	'http://localhost:5173',
	'http://localhost:5175',

];

const APP_API_TOKEN = process.env.APP_API_TOKEN || 'my-secure-api-token';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};


const handleOriginSecurity: Handle = async ({ event, resolve }) => {
	const origin = event.request.headers.get('origin');
	const pathname = event.url.pathname;
	const isAllowedOrigin = !origin || allowedOrigins.includes(origin);

	if (origin && !isAllowedOrigin) {
		return new Response('Forbidden: Unauthorized domain', { status: 403 });
	}

	if (pathname.startsWith('/api/')) {
		const apiToken = event.request.headers.get('x-app-token');
		if (!apiToken || apiToken !== APP_API_TOKEN) {
			return new Response('Unauthorized: Invalid API token', { status: 401 });
		}
	}

	const response = await resolve(event);

	if (isAllowedOrigin && origin) {
		response.headers.set('Access-Control-Allow-Origin', origin);
		response.headers.set('Access-Control-Allow-Credentials', 'true');
		response.headers.set('Vary', 'Origin');
	}

	return response;
};


export const handle: Handle = sequence(handleOriginSecurity, handleParaglide, handleAuth);
