import { cloudinaryService } from '$lib/server/service/cloudinaryService';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const writeTempFile = async (file: File) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
	await fs.writeFile(tempPath, buffer);
	return tempPath;
};

const uploadOrKeepImage = async (
	file: File | null,
	publicId?: string,
	existing?: { url: string; publicId: string }
) => {
	if (!file || file.size === 0) {
		return existing
			? { url: existing.url, publicId: existing.publicId }
			: { url: '', publicId: publicId || '' };
	}

	const tempPath = await writeTempFile(file);

	try {
		const result = publicId
			? await cloudinaryService.updateImage(publicId, tempPath)
			: await cloudinaryService.uploadImage(tempPath);
		return { url: result.url, publicId: result.publicId };
	} finally {
		await fs.unlink(tempPath).catch(() => { }); // pastikan file temp dihapus meski error
	}
};

export { uploadOrKeepImage, writeTempFile };
