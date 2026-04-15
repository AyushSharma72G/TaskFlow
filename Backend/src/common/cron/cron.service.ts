import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import config from '../../config/env.config';
import { deleteFile } from '../storage/storageOperations';
import { STORAGE_PROVIDER_KEYS } from '../storage/storage.interface';
import { AuthRepository } from '../../modules/auth/repositories/auth.repository';

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name);

	constructor(private readonly authRepository: AuthRepository) {}

	@Cron(config.ORPHANED_FILES_CLEANUP_CRON, {
		name: 'cleanup-orphaned-user-files',
	})
	async cleanupOrphanedFiles(): Promise<void> {
		const orphanedFiles = await this.authRepository.findOrphanedFiles();

		if (!orphanedFiles.length) {
			this.logger.debug('No orphaned user files found for cleanup.');
			return;
		}

		this.logger.log(
			`Starting orphaned file cleanup for ${orphanedFiles.length} file(s).`,
		);

		let deletedCount = 0;

		for (const file of orphanedFiles) {
			try {
				await deleteFile(STORAGE_PROVIDER_KEYS.cloudinary, file.fileKey);
				await this.authRepository.deleteUserFileById(file.id);
				deletedCount += 1;
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error';
				this.logger.error(
					`Failed to clean orphaned file ${file.fileKey}: ${message}`,
				);
			}
		}

		this.logger.log(
			`Completed orphaned file cleanup. Deleted ${deletedCount}/${orphanedFiles.length} file(s).`,
		);
	}
}
