import { json } from '@sveltejs/kit';
import { jwtProtect } from '$lib/hooks/jwtProtect';

export async function GET({ request }) {
	// Proteksi endpoint
	const jwtUser = await jwtProtect(request);

	// Jika berhasil diverifikasi
	return json({
		message: `Halo ${jwtUser}, kamu berhasil mengakses endpoint ini.`,
		data: [
			{ id: 1, name: 'Project Rahasia 1' },
			{ id: 2, name: 'Project Rahasia 2' }
		]
	});
}
