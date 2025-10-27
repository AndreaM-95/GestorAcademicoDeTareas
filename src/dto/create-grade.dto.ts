import { IsInt, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
export class CreateGradeDto {
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  score: number;
}

