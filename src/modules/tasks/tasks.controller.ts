import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('/api/tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva tarea' })
    @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o fecha límite en el pasado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Prohibido - Solo profesores pueden crear tareas' })
    @ApiResponse({ status: 409, description: 'Conflicto - Ya existe una tarea con ese título' })
    @Roles(Role.Professor)
    create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
        return this.tasksService.create(createTaskDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las tareas' })
    @ApiResponse({ status: 200, description: 'Lista de tareas obtenida exitosamente' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @Roles(Role.Professor, Role.Student)
    findAll(@Request() req) {
        return this.tasksService.findAll(req.user.userId, req.user.role);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una tarea por ID' })
    @ApiResponse({ status: 200, description: 'Tarea encontrada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Prohibido - No tienes acceso a esta tarea' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    @Roles(Role.Professor, Role.Student)
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.tasksService.findOne(id, req.user.userId, req.user.role);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una tarea existente' })
    @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Prohibido - No puedes modificar esta tarea' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    @Roles(Role.Professor)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
        return this.tasksService.update(id, updateTaskDto, req.user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una tarea' })
    @ApiResponse({ status: 200, description: 'Tarea eliminada exitosamente' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Prohibido - No puedes eliminar esta tarea' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
    @Roles(Role.Professor)
    delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.tasksService.remove(id, req.user.userId);
    }
}