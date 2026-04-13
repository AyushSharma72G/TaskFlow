import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
    Get,
    Param,
    Patch,
    Query,
    Delete,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetTasksQueryDto } from '../dto/get-tasks-query.dto';
import { AiDescriptionDto } from '../dto/ai-description.dto';
import { JwtCookieAuthGuard } from 'src/common/guards';
import type { AuthRequest } from 'src/common/guards';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    // create the task
    @Post()
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
        return this.tasksService.createTask(createTaskDto, req.user.id);
    }

    // get the task of the project id
    @Get(':projectId')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getTasksByProject(
        @Param('projectId') projectId: string,
        @Query() query: GetTasksQueryDto,
        @Req() req: any,
    ) {
        return this.tasksService.getTasksByProject(
            projectId,
            req.user.id,
            query.cursor,
            query.limit,
        );
    }

    // get a single task by id
    @Get(':taskId')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getTaskById(@Param('taskId') taskId: string, @Req() req: any) {
        return this.tasksService.getTaskById(taskId, req.user.id);
    }

    // get all assignees of a task
    @Get(':taskId/assignees')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getTaskAssignees(@Param('taskId') taskId: string, @Req() req: any) {
        return this.tasksService.getTaskAssignees(taskId, req.user.id);
    }

    // update the task
    @Patch(':taskId')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateTask(
        @Param('taskId') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Req() req: AuthRequest,
    ) {
        return this.tasksService.updateTask(taskId, updateTaskDto, req.user.id);
    }

    // delete the task
    @Delete(':taskId')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteTask(@Param('taskId') taskId: string, @Req() req: any) {
        return this.tasksService.deleteTask(taskId, req.user.id);
    }

    @Post('ai/generate-description')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async generateTaskDescription(
        @Body() aiDescriptionDto: AiDescriptionDto,
        @Req() req: AuthRequest,
    ) {
        return this.tasksService.generateTaskDescription(
            req.user.id,
            aiDescriptionDto,
        );
    }
}
