export const STORAGE_MESSAGES = {
    success: {
        fileUploaded: 'File uploaded successfully',
        fileDeleted: 'File deleted successfully',
        fileRetrieved: 'File retrieved successfully',
    },
    errors: {
        fileNotFound: 'File not found',
        fileTooLarge: 'File size exceeds the maximum allowed limit',
        uploadFailed: 'File upload failed',
        deleteFailed: 'File deletion failed',
        retrievalFailed: 'File retrieval failed',
        unsupportedMimeType: 'File type is not supported',
        unsupportedProvider: 'Unsupported storage provider',
        providerNotConfigured: 'Storage provider is not configured',
    },
} as const;
