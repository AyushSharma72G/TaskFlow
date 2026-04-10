import { STORAGE_MESSAGES } from '../../messages/storage.message';
import { STORAGE_CONSTANTS } from '../storage.constants';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import {
    IStorageProvider,
    STORAGE_PROVIDER_KEYS,
    StorageDeleteResult,
    StorageGetResult,
    StorageUploadInput,
    StorageUploadResult,
} from '../storage.interface';

export class CloudinaryStorageProvider implements IStorageProvider {
    readonly name = STORAGE_PROVIDER_KEYS.cloudinary;
    private static readonly RESOURCE_TYPES = ['image', 'video', 'raw'] as const;

    constructor() {
        if (this.isConfigured) {
            cloudinary.config({
                cloud_name: this.cloudName,
                api_key: this.apiKey,
                api_secret: this.apiSecret,
            });
        }
    }

    private get cloudName(): string {
        return process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? '';
    }

    private get apiKey(): string {
        return process.env.CLOUDINARY_API_KEY?.trim() ?? '';
    }

    private get apiSecret(): string {
        return process.env.CLOUDINARY_API_SECRET?.trim() ?? '';
    }

    private get isConfigured(): boolean {
        return !!(this.cloudName && this.apiKey && this.apiSecret);
    }

    async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
        if (!this.isConfigured) {
            throw new Error(STORAGE_MESSAGES.errors.providerNotConfigured);
        }

        if (input.buffer.length > STORAGE_CONSTANTS.MAX_FILE_SIZE_BYTES) {
            throw new Error(STORAGE_MESSAGES.errors.fileTooLarge);
        }

        if (
            input.mimeType &&
            !STORAGE_CONSTANTS.ALLOWED_MIME_TYPES.includes(
                input.mimeType as (typeof STORAGE_CONSTANTS.ALLOWED_MIME_TYPES)[number],
            )
        ) {
            throw new Error(STORAGE_MESSAGES.errors.unsupportedMimeType);
        }

        const uploadResult = await this.uploadBuffer(input);

        return {
            provider: this.name,
            fileKey: uploadResult.public_id,
            url: uploadResult.secure_url,
            fileName: input.fileName,
            mimeType: uploadResult.resource_type,
            size: uploadResult.bytes,
            metadata: input.metadata,
        };
    }

    async delete(fileKey: string): Promise<StorageDeleteResult> {
        if (!this.isConfigured) {
            throw new Error(STORAGE_MESSAGES.errors.providerNotConfigured);
        }

        await this.destroyResource(fileKey);

        return {
            provider: this.name,
            fileKey,
            deleted: true,
            message: STORAGE_MESSAGES.success.fileDeleted,
        };
    }

    async get(fileKey: string): Promise<StorageGetResult> {
        if (!this.isConfigured) {
            throw new Error(STORAGE_MESSAGES.errors.providerNotConfigured);
        }

        const resource = await this.findResource(fileKey);

        return {
            provider: this.name,
            fileKey,
            url: resource.secure_url,
            fileName:
                resource.original_filename ??
                fileKey.split('/').pop() ??
                fileKey,
            mimeType: resource.resource_type,
            size: resource.bytes,
        };
    }

    private uploadBuffer(input: StorageUploadInput): Promise<{
        public_id: string;
        secure_url: string;
        resource_type: string;
        bytes: number;
    }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: input.folder,
                    resource_type: 'auto',
                    public_id: this.sanitizeFileName(input.fileName),
                },
                (error, result) => {
                    if (error || !result) {
                        reject(
                            error ??
                                new Error(STORAGE_MESSAGES.errors.uploadFailed),
                        );
                        return;
                    }

                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        resource_type: result.resource_type,
                        bytes: result.bytes,
                    });
                },
            );

            Readable.from(input.buffer).pipe(uploadStream);
        });
    }

    private sanitizeFileName(fileName: string): string {
        return fileName
            .replace(/\.[^/.]+$/, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    }

    private async findResource(fileKey: string): Promise<{
        secure_url: string;
        original_filename?: string;
        resource_type: string;
        bytes?: number;
    }> {
        for (const resourceType of CloudinaryStorageProvider.RESOURCE_TYPES) {
            try {
                const resource = await cloudinary.api.resource(fileKey, {
                    resource_type: resourceType,
                });
                return resource;
            } catch {
                continue;
            }
        }

        throw new Error(`${STORAGE_MESSAGES.errors.fileNotFound}: ${fileKey}`);
    }

    private async destroyResource(fileKey: string): Promise<void> {
        for (const resourceType of CloudinaryStorageProvider.RESOURCE_TYPES) {
            try {
                const result = await cloudinary.uploader.destroy(fileKey, {
                    resource_type: resourceType,
                    invalidate: true,
                });

                if (result.result === 'ok' || result.result === 'not found') {
                    return;
                }
            } catch {
                continue;
            }
        }

        throw new Error(`${STORAGE_MESSAGES.errors.deleteFailed}: ${fileKey}`);
    }
}
