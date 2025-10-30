import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsInt } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Resolver ecuaciones cuadráticas', description: 'Título de la tarea' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Completar ejercicios del 1 al 10 del capítulo 5', description: 'Descripción de la tarea' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-15', description: 'Fecha de entrega', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: false, description: 'Estado de completitud', required: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiProperty({ example: '2025-12-15T23:59:59', description: 'Fecha límite de entrega' })
  @IsDateString()
  deadline: string;

  @ApiProperty({ example: 2, description: 'ID del estudiante asignado' })
  @IsInt()
  studentId: number;
}