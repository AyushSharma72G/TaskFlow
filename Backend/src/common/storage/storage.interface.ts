export const STORAGE_PROVIDER_KEYS = {
    cloudinary: 'cloudinary',
} as const;

export type StorageProviderName =
    (typeof STORAGE_PROVIDER_KEYS)[keyof typeof STORAGE_PROVIDER_KEYS];

export interface StorageUploadInput {
    buffer: Buffer;
    fileName: string;
    mimeType?: string;
    folder?: string;
    metadata?: Record<string, string>;
}

export interface StorageBaseFile {
    provider: StorageProviderName;
    fileKey: string;
    url: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
    metadata?: Record<string, string>;
}

export interface StorageUploadResult extends StorageBaseFile {}

export interface StorageDeleteResult {
    provider: StorageProviderName;
    fileKey: string;
    deleted: boolean;
    message: string;
}

export interface StorageGetResult extends StorageBaseFile {}

export interface IStorageProvider {
    readonly name: StorageProviderName;
    upload(input: StorageUploadInput): Promise<StorageUploadResult>;
    delete(fileKey: string): Promise<StorageDeleteResult>;
    get(fileKey: string): Promise<StorageGetResult>;
}

export interface IStorageRegistry {
    register(provider: IStorageProvider): void;
    getProvider(name: StorageProviderName): IStorageProvider;
    listProviders(): StorageProviderName[];
}
