import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con el estudiante
  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: number;

  // Relación: Una nota, tiene una tarea
  @OneToOne(() => Task, (task) => task.grade)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ nullable: false })
  score: number;
}
