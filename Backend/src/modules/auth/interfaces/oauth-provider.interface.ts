import type { Request } from 'express';

export interface OAuthCallbackResult {
    accessToken: string;
    refreshToken?: string;
    rawProfile: Record<string, any>;
    providerName: string;
}

export interface NormalisedUser {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    providerName: string;
    providerId: string;
}

export interface OAuthProvider {
    getAuthUrl(state?: string): string;
    validateCallback(req: Request): Promise<OAuthCallbackResult>;
    getUser(callbackResult: OAuthCallbackResult): Promise<NormalisedUser>;
}
