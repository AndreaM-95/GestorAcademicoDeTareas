import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateGradeException } from 'src/common/exceptions/grades/duplicate-grade.exception';
import { GradeNotFoundException } from 'src/common/exceptions/grades/grade-not-found.exception';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';
import { Grade } from 'src/entities/grade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  //FUNCIONA
  async findAll() {
    return await this.gradesRepository.find();
  }

  //FUNCIONA
  async findOne(id: number) {
    const gradeFind = await this.gradesRepository.findOne({ where: { id } });
    if (!gradeFind) throw new GradeNotFoundException(id);
    return gradeFind;
  }

  //listar notas según la tarea

  //FUNCIONA - Consultar refactorización 63 - 77
  /**
   * @description Crea una calificación si no existe para el estudiante y la tarea.
   * @param newGrade DTO con id del estudiante, id de la tarea y la calificación.
   * @returns Objeto con mensaje, estudiante, tarea y nota.
   */
  async create(newGrade: CreateGradeDto) {
    const { studentId, taskId, score } = newGrade;

    // Verificar existencia previa de calificación
    const gradeExists = await this.gradesRepository.findOne({
      where: { task: { id: taskId }, student: { id: studentId } },
      relations: ['task', 'student'],
    });

    if (gradeExists) {
      throw new DuplicateGradeException(studentId, taskId);
    }

    // Crear y guardar la nueva calificación
    const newGradeEntity = this.gradesRepository.create({
      score,
      student: { id: studentId },
      task: { id: taskId },
    });

    const savedGrade = await this.gradesRepository.save(newGradeEntity);

    // Obtener la calificación con las relaciones cargadas
    const grade = await this.gradesRepository.findOne({
      where: { id: savedGrade.id },
      relations: ['task', 'student'],
    });

    if (!grade) throw new GradeNotFoundException(savedGrade.id);

    const { firstName, lastName } = grade.student;
    return {
      message: '✅ Calificación creada correctamente',
      studentName: `${firstName} ${lastName}`,
      taskTitle: grade.task.title,
      score: grade.score,
    };
  }

  async update(id: number, updateGrade: UpdateGradeDto) {
    await this.gradesRepository.update(id, { ...updateGrade });
    return this.findOne(id);
  }

  /**
   * @description Toma el id del estudiante y devuelve todas sus notas
   * @returns Lista de notas
   */

  //TODO: Mostrar datos del estudiante
  // async findByStudent(student: number) {
  //   return await this.gradesRepository.find({ where: { student: { id: student } } });
  // }

  /**
   * @description Toma el id del estudiante y calcula el promedio de sus notas
   * @returns El promedio de las notas
   */
  // async getStudentAverage(studentId: number) {
  //   const grades = await this.findByStudent(studentId);
  //   if (grades.length === 0) return 0;

  //   const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
  //   const averageScore = parseFloat((totalScore / grades.length).toFixed(2));
  //   return averageScore;
  // }

  // async remove(id: number) {
  //   const result = await this.gradesRepository.delete(id);
  //   if (result.affected === 0)
  //     throw new BadRequestException(
  //       `Calificación con id #${id} no encontrada.`,
  //     );
  //   return { message: 'Calificación eliminada correctamente' };
  // }
}
