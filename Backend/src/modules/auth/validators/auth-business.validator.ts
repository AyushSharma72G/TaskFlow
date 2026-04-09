import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AUTH_MESSAGES } from '../../../common/messages/auth.messages';
import type { NormalisedUser } from '../interfaces/oauth-provider.interface';

@Injectable()
export class AuthBusinessValidator {
    validatePasswordStrength(password: string): void {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        if (!(hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
            throw new BadRequestException(
                AUTH_MESSAGES.errors.passwordPolicyNotMet,
            );
        }
    }

    validateOAuthState(params: {
        stateFromProvider?: string;
        stateFromCookie?: string;
    }): void {
        const { stateFromProvider, stateFromCookie } = params;

        if (!stateFromCookie) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.oauthStateMissing,
            );
        }

        if (!stateFromProvider || stateFromProvider !== stateFromCookie) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidOAuthState,
            );
        }
    }

    validateOAuthUser(user: NormalisedUser): void {
        if (!user.providerId) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidOAuthProviderData,
            );
        }

        if (!user.email) {
            throw new BadRequestException(AUTH_MESSAGES.errors.oauthEmailRequired);
        }
    }
}
