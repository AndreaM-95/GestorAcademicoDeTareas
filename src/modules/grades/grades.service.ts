import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateGradeException } from 'src/common/exceptions/grades/duplicate-grade.exception';
import { GradeNotFoundException } from 'src/common/exceptions/grades/grade-not-found.exception';
import { NoGradesException } from 'src/common/exceptions/grades/no-grade.exception';
import { TaskNotFoundException } from 'src/common/exceptions/tasks/task-not-found.exception';
import { UserNotFoundException } from 'src/common/exceptions/users/user-not-found.exception';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';
import { Grade } from 'src/entities/grade.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<Grade>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,

  ) {}

  /**
   * @description Crea una calificación si no existe para el estudiante y la tarea.
   * @param newGrade DTO con id del estudiante, id de la tarea y la calificación.
   * @returns Objeto con mensaje, estudiante, tarea y nota.
  */
  async create(newGrade: CreateGradeDto) {
    const { studentId, taskId, score } = newGrade;

    // Validar existencia del estudiante
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });
    if (!student) throw new UserNotFoundException();

    // Validar existencia de la tarea
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['student'], // Para poder validar el id del estudiante
    });
    if (!task) throw new TaskNotFoundException(taskId);

    // Validar que la tarea esté completada
    if (!task.isCompleted) {
      throw new BadRequestException(
        `La tarea "${task.title}" no está completada. No se puede calificar.`
      );
    }

    // Validar que el estudiante asignado a la tarea sea el mismo que intenta calificar
    if (task.student.id !== studentId) {
      throw new BadRequestException(
        `El estudiante con ID ${studentId} no coincide con el estudiante asignado a la tarea "${task.title}"`
      );
    }

    // Validar que no exista ya una calificación para este estudiante y tarea
    const gradeExists = await this.gradesRepository.findOne({
      where: { task: { id: taskId }, student: { id: studentId } },
    });
    if (gradeExists) throw new DuplicateGradeException(studentId, taskId);

    // Crear y guardar la nueva calificación
    const newGradeEntity = this.gradesRepository.create({
      score,
      student: { id: studentId },
      task: { id: taskId },
    });

    const savedGrade = await this.gradesRepository.save(newGradeEntity);

    // Cargar la información completa de la calificación creada
    const grade = await this.gradesRepository.findOne({
      where: { id: savedGrade.id },
      relations: ['task', 'student'],
    });

    if (!grade) throw new GradeNotFoundException(savedGrade.id);

    const { firstName, lastName } = grade.student;
    return {
      message: 'Calificación creada correctamente',
      studentName: `${firstName} ${lastName}`,
      taskTitle: grade.task.title,
      score: grade.score,
    };
  }

  /**
   * @description Actualiza la calificación existente en la base de datos. Utiliza el método `preload()` de TypeORM para cargar la entidad actual y fusionar los nuevos valores recibidos desde el DTO.
   * @param id - Identificador único de la calificación a actualizar.
   * @param updateGrade - Objeto que contiene los campos a modificar 
   */
  async update(id: number, updateGrade: UpdateGradeDto) {
    const { score } = updateGrade;

    const gradeToUpdate = await this.gradesRepository.preload({
      id,
      score
    });

    if (!gradeToUpdate) throw new GradeNotFoundException(id);
    await this.gradesRepository.save(gradeToUpdate);
    return { message: 'Calificación modificada correctamente'};
  }

  /**
   * @description Toma el id del estudiante y devuelve todas sus notas con información del estudiante y tareas
   * @param student - ID del estudiante
   * @returns Objeto con información del estudiante y lista de sus calificaciones
   */
  async findByStudent(student: number) {
    const grades = await this.gradesRepository.find({ 
      where: { student: { id: student } },
      relations: ['student', 'task']
    });

    if (grades.length === 0) throw new NoGradesException();

    const { firstName, lastName } = grades[0].student;

    let message = {
      studentName: `${firstName} ${lastName}`,
      studentId: student,
      grades: grades.map(grade => ({
        taskTitle: grade.task.title,
        score: grade.score
      })),
      totalGrades: grades.length
    };

    return message;
  }

  /**
   * @description Toma el id del estudiante y calcula el promedio de sus notas
   * @returns Mensaje informativo con el promedio y si aprobó o no
   */
  async getStudentAverage(studentId: number) {
    const grades = await this.gradesRepository.find({ 
      where: { student: { id: studentId } },
      relations: ['student', 'task']
    });

    if (grades.length === 0) throw new NoGradesException();

    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const averageScore = totalScore / grades.length;

    const message =
      averageScore >= 3
        ? `Su promedio es: ${averageScore.toFixed(1)}. Aprobó la materia.`
        : `Su promedio es: ${averageScore.toFixed(1)}. No aprobó la materia.`;

    return message;
  }

  /**
   * @description Elimina una calificación asociada a una tarea
   * @param id de la calificación
   * @returns Mensaje de confirmación
   */
  async remove(id: number) {
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0) throw new GradeNotFoundException(id);
    return { message: 'Calificación eliminada correctamente' };
  }
}
