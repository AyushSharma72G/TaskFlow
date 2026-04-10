import { BadRequestException, Injectable } from '@nestjs/common';
import { STORAGE_MESSAGES } from '../messages/storage.message';
import { CloudinaryStorageProvider } from './providers/cloudinary.provider';
import {
    IStorageProvider,
    IStorageRegistry,
    StorageProviderName,
} from './storage.interface';

export const defaultStorageProviders: IStorageProvider[] = [
    new CloudinaryStorageProvider(),
];

@Injectable()
export class StorageProviderRegistry implements IStorageRegistry {
    private readonly providers = new Map<
        StorageProviderName,
        IStorageProvider
    >();

    constructor(
        storageProviders: IStorageProvider[] = defaultStorageProviders,
    ) {
        for (const provider of storageProviders) {
            this.register(provider);
        }
    }

    register(provider: IStorageProvider): void {
        this.providers.set(provider.name, provider);
    }

    getProvider(name: StorageProviderName): IStorageProvider {
        const provider = this.providers.get(name);
        if (!provider) {
            throw new BadRequestException(
                `${STORAGE_MESSAGES.errors.unsupportedProvider}: ${name}`,
            );
        }
        return provider;
    }

    listProviders(): StorageProviderName[] {
        return [...this.providers.keys()];
    }
}

export const storageProviderRegistry = new StorageProviderRegistry();
