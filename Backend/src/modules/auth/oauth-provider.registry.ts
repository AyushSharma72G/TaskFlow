import {
    BadRequestException,
    Inject,
    Injectable,
    OnModuleInit,
} from '@nestjs/common';
import { OAUTH_PROVIDERS } from './constants/oauth.constants';
import type { OAuthProvider } from './interfaces/oauth-provider.interface';
import { GoogleProvider } from './providers/google.provider';
import { GithubProvider } from './providers/github.provider';

@Injectable()
export class OAuthProviderRegistry implements OnModuleInit {
    private readonly providers = new Map<string, OAuthProvider>();

    constructor(
        @Inject(OAUTH_PROVIDERS)
        private readonly oauthProviders: OAuthProvider[],
    ) {}

    onModuleInit(): void {
        for (const provider of this.oauthProviders) {
            if (provider instanceof GoogleProvider) {
                this.register('google', provider);
                continue;
            }
            if (provider instanceof GithubProvider) {
                this.register('github', provider);
            }
        }
    }

    register(name: string, provider: OAuthProvider): void {
        this.providers.set(name.toLowerCase(), provider);
    }

    get(name: string): OAuthProvider {
        const provider = this.providers.get(name.toLowerCase());
        if (!provider) {
            throw new BadRequestException(`Unsupported OAuth provider: ${name}`);
        }
        return provider;
    }

    list(): string[] {
        return [...this.providers.keys()];
    }
}
