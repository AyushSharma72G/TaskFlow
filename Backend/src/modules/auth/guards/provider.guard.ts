import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { OAuthProviderRegistry } from '../oauth-provider.registry';

@Injectable()
export class ProviderGuard implements CanActivate {
    constructor(private readonly providerRegistry: OAuthProviderRegistry) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const paramValue = request.params?.provider;
        const provider =
            typeof paramValue === 'string' ? paramValue : paramValue?.[0];

        if (!provider) {
            throw new BadRequestException('OAuth provider is required');
        }

        this.providerRegistry.get(provider);
        return true;
    }
}
