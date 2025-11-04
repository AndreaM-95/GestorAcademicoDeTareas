import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeDto } from './create-grade.dto';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto extends PartialType(CreateGradeDto) {
    @ApiProperty({ example: '4', description: 'Calificación de 1 a 5 en números enteros' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    score: number;
}
