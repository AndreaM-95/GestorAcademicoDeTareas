import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Grade } from './grade.entity';
// import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column({ default: false })
  isCompleted: boolean;

  // Relación: Una tarea tiene una nota
  @Column({ nullable: false })
  @OneToOne(() => Grade, (grade) => grade.score)
  grade: Grade;

  // Relación con profesor (se completará más adelante)
  //   @ManyToOne(() => User, (user) => user.tasks, { nullable: true, eager: true })
  //   teacher: User;
}
