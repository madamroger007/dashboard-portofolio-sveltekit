import cloudinary from '$lib/utils/cloudinaryClient';

export interface UploadResult {
	publicId: string;
	url: string;
}

export const cloudinaryService = {
	async uploadImage(filePath: string, folder = 'portfolio'): Promise<UploadResult> {
		const result = await cloudinary.uploader.upload(filePath, {
			folder,
			resource_type: 'image',
			transformation: [
				{
					width: 1920,
					crop: 'limit',
					fetch_format: 'auto',
					quality: 'auto:eco',
					flags: 'progressive',
					strip: true
				}
			]
		});
		return { publicId: result.public_id, url: result.secure_url };
	},

	async updateImage(publicId: string, filePath: string): Promise<UploadResult> {
		const result = await cloudinary.uploader.upload(filePath, {
			public_id: publicId,
			overwrite: true,
			invalidate: true,
			resource_type: 'image',
			transformation: [
				{
					width: 1920,
					crop: 'limit',
					fetch_format: 'auto',
					quality: 'auto:eco',
					flags: 'progressive',
					strip: true
				}
			]
		});
		return { publicId: result.public_id, url: result.secure_url };
	},

	async deleteImage(publicId: string): Promise<void> {
		await cloudinary.uploader.destroy(publicId);
	},

	async listImages(folder = 'portfolio') {
		const result = await cloudinary.search
			.expression(`folder:${folder}`)
			.sort_by('created_at', 'desc')
			.max_results(30)
			.execute();

		return result.resources.map((r: any) => ({
			publicId: r.public_id,
			url: r.secure_url
		}));
	}
};
