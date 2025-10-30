import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { Task } from '../../entities/task.entity';
import { TaskAlreadyExistsException } from '../../common/exceptions/tasks/task-already-exists.exception';
import { TaskNotFoundException } from '../../common/exceptions/tasks/task-not-found.exception';
import { InvalidTaskDeadlineException } from '../../common/exceptions/tasks/invalid-task-deadline.exception';
import { UnauthorizedTaskAccessException } from '../../common/exceptions/tasks/unauthorized-task-access.exception';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, professorId: number){
    // Validar que no exista una tarea con el mismo título
    const existingTask = await this.taskRepository.findOne({
      where: { title: createTaskDto.title },
    });

    if (existingTask) {
      throw new TaskAlreadyExistsException(createTaskDto.title);
    }

    // Validar que la fecha límite sea futura
    const now = new Date();
    if (new Date(createTaskDto.deadline) < now) {
      throw new InvalidTaskDeadlineException();
    }

    // Crear la tarea asociándola al estudiante y al profesor que la crea
    const task = this.taskRepository.create({
      ...createTaskDto,
      student: { id: createTaskDto.studentId }
    });
    
    return await this.taskRepository.save(task);
  }

  async findAll(userId: number, userRole: string) {
    // Si es profesor, puede ver todas las tareas
    if (userRole === 'professor') {
      return await this.taskRepository.find({
        relations: ['student']
      });
    }
    
    // Si es estudiante, solo puede ver SUS tareas asignadas
    return await this.taskRepository.find({
      where: { student: { id: userId } },
      relations: ['student']
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const task = await this.taskRepository.findOne({ 
      where: { id },
      relations: ['student']
    });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    // Si es estudiante, validar que la tarea le pertenezca
    if (userRole === 'student' && task.student.id !== userId) {
      throw new UnauthorizedTaskAccessException();
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, professorId: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['student']
    });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    // Validar fecha límite si se está actualizando
    if (updateTaskDto.deadline && new Date(updateTaskDto.deadline) < new Date()) {
      throw new InvalidTaskDeadlineException();
    }

    // Actualizar la tarea
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: number, professorId: number) {
    const task = await this.taskRepository.findOne({
      where: { id }
    });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    await this.taskRepository.delete(id);
    return { message: 'Tarea eliminada correctamente' };
  }
}