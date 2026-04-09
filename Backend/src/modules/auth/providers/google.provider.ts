import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request, Response } from 'express';
import passport from 'passport';
import {
    Strategy,
    type Profile,
} from 'passport-google-oauth20';
import config from '../../../config/env.config';
import {
    type NormalisedUser,
    type OAuthCallbackResult,
    type OAuthProvider,
} from '../interfaces/oauth-provider.interface';
import { OAUTH_STRATEGIES } from '../constants/oauth.constants';

type OAuthErrorLike = {
    message?: string;
    status?: number;
    statusCode?: number;
    code?: string;
    oauthError?: {
        data?: string;
        statusCode?: number;
    };
};

type GoogleValidatedUser = {
    accessToken: string;
    refreshToken?: string;
    profile: Profile;
};

function extractOAuthErrorDetails(error: unknown): string | null {
    if (!error || typeof error !== 'object') {
        return null;
    }

    const typedError = error as OAuthErrorLike;
    const directMessage = typedError.message?.trim();
    if (directMessage) {
        return directMessage;
    }

    const oauthData = typedError.oauthError?.data?.trim();
    if (oauthData) {
        return oauthData;
    }

    const parts: string[] = [];
    if (typedError.code) {
        parts.push(`code=${typedError.code}`);
    }

    const status =
        typedError.statusCode ??
        typedError.oauthError?.statusCode ??
        typedError.status;
    if (status) {
        parts.push(`status=${status}`);
    }

    return parts.length > 0 ? parts.join(', ') : null;
}

@Injectable()
export class GoogleProvider
    extends PassportStrategy(Strategy, OAUTH_STRATEGIES.google)
    implements OAuthProvider
{
    constructor() {
        super({
            clientID: config.GOOGLE_CLIENT_ID ?? '',
            clientSecret: config.GOOGLE_CLIENT_SECRET ?? '',
            callbackURL: config.GOOGLE_CALLBACK_URL ?? '',
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });
    }

    getAuthUrl(state?: string): string {
        const clientId = config.GOOGLE_CLIENT_ID ?? '';
        const callbackUrl = config.GOOGLE_CALLBACK_URL ?? '';
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

        url.searchParams.set('client_id', clientId);
        url.searchParams.set('redirect_uri', callbackUrl);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('scope', 'openid profile email');
        url.searchParams.set('access_type', 'offline');
        url.searchParams.set('prompt', 'consent');
        if (state) {
            url.searchParams.set('state', state);
        }

        return url.toString();
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: Error | null, user?: GoogleValidatedUser) => void,
    ): Promise<void> {
        done(null, {
            accessToken,
            refreshToken,
            profile,
        } as GoogleValidatedUser);
    }

    validateCallback(req: Request): Promise<OAuthCallbackResult> {
        return new Promise((resolve, reject) => {
            const middleware = passport.authenticate(
                OAUTH_STRATEGIES.google,
                { session: false },
                (error: unknown, user: GoogleValidatedUser | false) => {
                    if (error || !user) {
                        const details = extractOAuthErrorDetails(error);
                        const message = details
                            ? `Google OAuth callback validation failed: ${details}`
                            : 'Google OAuth callback validation failed';

                        reject(new UnauthorizedException(message));
                        return;
                    }

                    resolve({
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        rawProfile: user.profile as unknown as Record<string, any>,
                        providerName: OAUTH_STRATEGIES.google,
                    });
                },
            );

            const response = req.res as Response | undefined;
            middleware(req, response as Response, () => undefined);
        });
    }

    async getUser(
        callbackResult: OAuthCallbackResult,
    ): Promise<NormalisedUser> {
        const profile = callbackResult.rawProfile as Profile;
        const firstEmail = profile.emails?.[0]?.value ?? '';
        const firstName = profile.name?.givenName ?? '';
        const lastName = profile.name?.familyName ?? '';
        const avatar = profile.photos?.[0]?.value;

        return {
            email: firstEmail,
            firstName,
            lastName,
            avatar,
            providerName: OAUTH_STRATEGIES.google,
            providerId: profile.id,
        };
    }
}
