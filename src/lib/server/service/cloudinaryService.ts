import { cloudinaryRepository } from '$lib/server/repositories/cloudinaryRepository';

export const cloudinaryService = {
	async addImage(filePath: string) {
		try {
			return await cloudinaryRepository.uploadImage(filePath);
		} catch (err) {
			console.error('Cloudinary upload error:', err);
			throw new Error('Failed to upload image');
		}
	},

	async replaceImage(publicId: string, filePath: string) {
		try {

			if (publicId) {
				return await cloudinaryRepository.updateImage(publicId, filePath);
			}
			return await cloudinaryRepository.uploadImage(filePath);
		} catch (err) {
			console.error('Cloudinary replace error:', err);
			throw new Error('Failed to replace image');
		}
	},

	async removeImage(publicId: string) {
		try {
			if (publicId) await cloudinaryRepository.deleteImage(publicId);
		} catch (err) {
			console.error('Cloudinary delete error:', err);
		}
	},

	async getAllImages() {
		return await cloudinaryRepository.listImages();
	}
};
