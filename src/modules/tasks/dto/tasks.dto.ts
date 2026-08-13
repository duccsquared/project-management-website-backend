export class TaskDTO {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId?: number;
  position?: number;
  dueDate?: Date;
  createdAt?: Date;
}