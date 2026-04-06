import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtCookieAuthGuard, type AuthRequest } from '../../../common/guards';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from '../dto/auth.dto';
import { AUTH_MESSAGES } from '../../../common/messages/auth.messages';
import { AuthService } from '../services/auth.service';
import config from '../../../config/env.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);
    this.setAuthCookies(response, accessToken, refreshToken);

    return {
      success: true,
      message: AUTH_MESSAGES.success.userRegistered,
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);
    this.setAuthCookies(response, accessToken, refreshToken);
    return {
      success: true,
      message: AUTH_MESSAGES.success.loginSuccessful,
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  @Post('logout')
  @UseGuards(JwtCookieAuthGuard)
  async logout(
    @Req() request: AuthRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.revokeRefreshToken(request.user.id);
    response.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      path: '/',
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      path: '/',
    });
    return {
      success: true,
      message: AUTH_MESSAGES.success.logoutSuccessful,
      data: null,
    };
  }
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException(
        AUTH_MESSAGES.errors.refreshTokenRequired,
      );
    }
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.authService.refresh(refreshToken);
    this.setAuthCookies(response, accessToken, newRefreshToken);
    return {
      success: true,
      message: AUTH_MESSAGES.success.tokenRefreshed,
      data: user,
    };
  }
  @Get('profile')
  @UseGuards(JwtCookieAuthGuard)
  async getProfile(@Req() request: AuthRequest) {
    const user = await this.authService.getProfile(request.user.id);
    return {
      success: true,
      message: AUTH_MESSAGES.success.profileRetrieved,
      data: user,
    };
  }
  @Get('me/role')
  @UseGuards(JwtCookieAuthGuard)
  async getCurrentUserRole(
    @Req() request: AuthRequest,
    @Query('projectId') projectId?: string,
  ) {
    if (!projectId) {
      throw new BadRequestException(AUTH_MESSAGES.errors.projectIdRequired);
    }
    const role = await this.authService.getCurrentUserRole(
      request.user.id,
      projectId,
    );
    return {
      success: true,
      message: AUTH_MESSAGES.success.currentUserRoleRetrieved,
      data: role,
    };
  }
  @Patch('profile')
  @UseGuards(JwtCookieAuthGuard)
  async updateProfile(
    @Req() request: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.authService.updateProfile(request.user.id, dto);
    return {
      success: true,
      message: AUTH_MESSAGES.success.profileUpdated,
      data: user,
    };
  }
  @Patch('change-password')
  @UseGuards(JwtCookieAuthGuard)
  async changePassword(
    @Req() request: AuthRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(request.user.id, dto);
    return {
      success: true,
      message: AUTH_MESSAGES.success.passwordChanged,
      data: null,
    };
  }
  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      path: '/',
      maxAge: this.parseDurationToMs(config.ACCESS_TOKEN_EXPIRES_IN),
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      path: '/',
      maxAge: this.parseDurationToMs(config.REFRESH_TOKEN_EXPIRES_IN),
    });
  }
  private parseDurationToMs(duration: string): number {
    const normalized = duration.trim();
    const match = normalized.match(/^(\d+)([smhd])$/i);
    if (!match) {
      const asNumber = Number(normalized);
      if (!Number.isNaN(asNumber) && asNumber > 0) {
        return asNumber * 1000;
      }
      return 15 * 60 * 1000;
    }
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 15 * 60 * 1000;
    }
  }
}
