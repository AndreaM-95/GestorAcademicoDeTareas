import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(Role.Professor)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Patch(':id')
  @Roles(Role.Professor)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  @Get('student/:studentId')
  @Roles(Role.Professor)
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.findByStudent(studentId);
  }

  @Get('student/:studentId/average')
  @Roles(Role.Professor, Role.Student)
  getStudentAverage(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.getStudentAverage(studentId);
  }

  @Delete(':id')
  @Roles(Role.Professor)
  remove(@Param('id') id: number) {
    return this.gradesService.remove(id);
  }
}
