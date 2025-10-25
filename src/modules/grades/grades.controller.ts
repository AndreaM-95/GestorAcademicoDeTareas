import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  findAll() {
    return this.gradesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gradesService.findOne(id);
  }

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  update(@Param('id') id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  // Listar notas por estudiante
  @Get('student/:studentId')
  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor)
  findByStudent(@Param('studentId') studentId: number) {
    return this.gradesService.findByStudent(studentId);
  }

  // Calcular promedio de notas de un estudiante
  @Get('student/:studentId/average')
  @UseGuards(RolesGuard)
  @Roles(Role.Professor, Role.Student)
  getStudentAverage(@Param('studentId') studentId: number) {
    return this.gradesService.getStudentAverage(studentId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  remove(@Param('id') id: number) {
    return this.gradesService.remove(id);
  }
}
