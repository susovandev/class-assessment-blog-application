import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index.js';
import {
	CLOUDINARY_RESOURCE_TYPE,
	CLOUDINARY_FOLDER_NAME,
} from '../constants/index.js';

cloudinary.config({
	cloud_name: config.CLOUDINARY_CLOUD_NAME,
	api_key: config.CLOUDINARY_API_KEY,
	api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (params) => {
	const {
		localFilePath,
		resourceType = CLOUDINARY_RESOURCE_TYPE,
		uploadFolder = CLOUDINARY_FOLDER_NAME,
		options,
	} = params;
	console.debug(`Uploading file to Cloudinary. Resource Type: ${resourceType}`);

	if (!localFilePath) {
		console.warn('No local file path provided for video upload');
		return null;
	}

	try {
		const uploadResult = await cloudinary.uploader.upload(localFilePath, {
			folder: uploadFolder,
			resource_type: resourceType,
			...options,
		});

		console.debug(`File uploaded to cloudinary: ${uploadResult?.public_id}`);

		return uploadResult;
	} catch (error) {
		console.error('Cloudinary file upload failed', error);
		throw error;
	}
};

export const deleteFromCloudinary = async (publicId) => {
	try {
		console.debug(`Preparing to delete image from Cloudinary: ${publicId}`);

		if (!publicId) {
			console.warn('No public id provided for image deletion');
			return null;
		}

		console.debug(`Deleting image from cloudinary: ${publicId}`);

		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: 'image',
		});

		if (result.result !== 'ok') {
			console.error(
				`Image deletion returned unexpected result: ${result.result}`,
			);
			return null;
		}

		console.log(`Image deleted from cloudinary: ${publicId}`);
	} catch (error) {
		console.error(`Cloudinary image delete failed for ID: ${publicId}`, error);
		throw error;
	}
};
