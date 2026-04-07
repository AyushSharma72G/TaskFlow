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
    Delete,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtCookieAuthGuard } from 'src/common/guards';

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
        @Req() req: any,
    ) {
        return this.tasksService.getTasksByProject(projectId, req.user.id);
    }

    // update the task
    @Patch(':taskId')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateTask(
        @Param('taskId') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Req() req: any,
    ) {
        return this.tasksService.updateTask(taskId, updateTaskDto, req.user.id);
    }

    @Delete(':taskId')
    @UseGuards(JwtCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteTask(@Param('taskId') taskId: string, @Req() req: any) {
        return this.tasksService.deleteTask(taskId, req.user.id);
    }
}
