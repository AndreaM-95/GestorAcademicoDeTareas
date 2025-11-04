import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from 'src/entities/grade.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Grade])],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}
