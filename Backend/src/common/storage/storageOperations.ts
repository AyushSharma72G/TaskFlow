import { InternalServerErrorException } from '@nestjs/common';
import { STORAGE_MESSAGES } from '../messages/storage.message';
import {
    StorageProviderRegistry,
    storageProviderRegistry,
} from './provider.registry';
import {
    StorageDeleteResult,
    StorageGetResult,
    StorageProviderName,
    StorageUploadInput,
    StorageUploadResult,
} from './storage.interface';

export async function uploadFile(
    providerName: StorageProviderName,
    input: StorageUploadInput,
    registry: StorageProviderRegistry = storageProviderRegistry,
): Promise<StorageUploadResult> {
    try {
        const provider = registry.getProvider(providerName);
        return await provider.upload(input);
    } catch (error) {
        throw new InternalServerErrorException(
            `${STORAGE_MESSAGES.errors.uploadFailed}: ${error}`,
        );
    }
}

export async function deleteFile(
    providerName: StorageProviderName,
    fileKey: string,
    registry: StorageProviderRegistry = storageProviderRegistry,
): Promise<StorageDeleteResult> {
    try {
        const provider = registry.getProvider(providerName);
        return await provider.delete(fileKey);
    } catch (error) {
        throw new InternalServerErrorException(
            `${STORAGE_MESSAGES.errors.deleteFailed}: ${error}`,
        );
    }
}

export async function getFile(
    providerName: StorageProviderName,
    fileKey: string,
    registry: StorageProviderRegistry = storageProviderRegistry,
): Promise<StorageGetResult> {
    try {
        const provider = registry.getProvider(providerName);
        return await provider.get(fileKey);
    } catch (error) {
        throw new InternalServerErrorException(
            `${STORAGE_MESSAGES.errors.retrievalFailed}: ${error}`,
        );
    }
}
