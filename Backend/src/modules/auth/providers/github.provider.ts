import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request, Response } from 'express';
import passport from 'passport';
import {
    Strategy,
    type Profile,
} from 'passport-github2';
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

type GithubValidatedUser = {
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
export class GithubProvider
    extends PassportStrategy(Strategy, OAUTH_STRATEGIES.github)
    implements OAuthProvider
{
    constructor() {
        super({
            clientID: config.GITHUB_CLIENT_ID ?? '',
            clientSecret: config.GITHUB_CLIENT_SECRET ?? '',
            callbackURL: config.GITHUB_CALLBACK_URL ?? '',
            scope: ['read:user', 'user:email'],
            passReqToCallback: false,
        });
    }

    getAuthUrl(state?: string): string {
        const clientId = config.GITHUB_CLIENT_ID ?? '';
        const callbackUrl = config.GITHUB_CALLBACK_URL ?? '';
        const url = new URL('https://github.com/login/oauth/authorize');

        url.searchParams.set('client_id', clientId);
        url.searchParams.set('redirect_uri', callbackUrl);
        url.searchParams.set('scope', 'read:user user:email');
        if (state) {
            url.searchParams.set('state', state);
        }

        return url.toString();
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: Error | null, user?: GithubValidatedUser) => void,
    ): Promise<void> {
        done(null, {
            accessToken,
            refreshToken,
            profile,
        } as GithubValidatedUser);
    }

    validateCallback(req: Request): Promise<OAuthCallbackResult> {
        return new Promise((resolve, reject) => {
            const middleware = passport.authenticate(
                OAUTH_STRATEGIES.github,
                { session: false },
                (error: unknown, user: GithubValidatedUser | false) => {
                    if (error || !user) {
                        const details = extractOAuthErrorDetails(error);
                        const message = details
                            ? `GitHub OAuth callback validation failed: ${details}`
                            : 'GitHub OAuth callback validation failed';

                        reject(new UnauthorizedException(message));
                        return;
                    }

                    resolve({
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        rawProfile: user.profile as unknown as Record<string, any>,
                        providerName: OAUTH_STRATEGIES.github,
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
        const displayName = (profile.displayName ?? '').trim();
        const split = displayName.split(' ').filter(Boolean);
        const firstName = split[0] ?? profile.username ?? '';
        const lastName = split.length > 1 ? split.slice(1).join(' ') : 'Github';
        const avatar = profile.photos?.[0]?.value;
        const email = profile.emails?.[0]?.value ?? '';

        return {
            email,
            firstName,
            lastName,
            avatar,
            providerName: OAUTH_STRATEGIES.github,
            providerId: profile.id,
        };
    }
}
