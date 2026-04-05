import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../../config/env.config';
import { AUTH_MESSAGES } from '../messages/auth.messages';

type JwtPayload = {
	sub: string;
	email: string;
};

export type AuthRequest = Request & {
	user: {
		id: string;
		email: string;
	};
};

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<AuthRequest>();
		const token = request.cookies?.access_token as string | undefined;

		if (!token) {
			throw new UnauthorizedException(AUTH_MESSAGES.errors.authenticationRequired);
		}
		try {
			const payload = verify(
				token,
				config.JWT_SECRET,
			) as JwtPayload;
			if (!payload?.sub || !payload?.email) {
				throw new UnauthorizedException(AUTH_MESSAGES.errors.invalidTokenPayload);
			}
			request.user = {
				id: payload.sub,
				email: payload.email,
			};
			return true;
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			throw new UnauthorizedException(AUTH_MESSAGES.errors.invalidOrExpiredToken);
		}
	}
}