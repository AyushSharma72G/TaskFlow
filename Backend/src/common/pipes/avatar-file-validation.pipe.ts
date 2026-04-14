import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { AUTH_MESSAGES } from '../messages/auth.messages';
import config from '../../config/env.config';

const avatarFileValidationPipe = new ParseFilePipeBuilder()
    .addMaxSizeValidator({
        maxSize: config.AVATAR_MAX_SIZE_BYTES,
        errorMessage: AUTH_MESSAGES.errors.avatarTooLarge,
    })
    .build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    });

export { avatarFileValidationPipe };
