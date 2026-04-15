import { Module } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../../common/guards';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { OAUTH_PROVIDERS } from './constants/oauth.constants';
import { GithubProvider } from './providers/github.provider';
import { GoogleProvider } from './providers/google.provider';
import { OAuthProviderRegistry } from './oauth-provider.registry';
import { ProviderGuard } from './guards/provider.guard';
import config from '../../config/env.config';
import { AuthBusinessValidator } from './validators/auth-business.validator';

const oauthStrategyProviders = [
    ...(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET
        ? [GoogleProvider]
        : []),
    ...(config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET
        ? [GithubProvider]
        : []),
];

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        AuthBusinessValidator,
        JwtCookieAuthGuard,
        ProviderGuard,
        ...oauthStrategyProviders,
        {
            provide: OAUTH_PROVIDERS,
            useFactory: (
                googleProvider?: GoogleProvider,
                githubProvider?: GithubProvider,
            ) => [googleProvider, githubProvider].filter(Boolean),
            inject: [
                { token: GoogleProvider, optional: true },
                { token: GithubProvider, optional: true },
            ],
        },
        OAuthProviderRegistry,
    ],
    exports: [AuthRepository],
})
export class AuthModule {}
