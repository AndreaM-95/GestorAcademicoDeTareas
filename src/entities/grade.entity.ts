import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación: Una nota, tiene una tarea
  @OneToOne(() => Task, (task) => task.grade)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ nullable: false })
  score: number;
}
