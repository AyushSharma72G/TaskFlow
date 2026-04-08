import { Module } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../../common/guards';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, JwtCookieAuthGuard],
})
export class AuthModule {}
