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

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor)
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor)
  @Get('student/:studentId')
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.findByStudent(studentId);
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor, Role.Student)
  @Get('student/:studentId/average')
  getStudentAverage(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.getStudentAverage(studentId);
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.Professor)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gradesService.remove(id);
  }
}
