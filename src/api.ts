import { z } from 'zod';
import { insertGroupSchema } from './db/schemas/groups';
import { insertRoleSchema } from './db/schemas/roles';
import { insertUserSchema } from './db/schemas/users';
import { insertRoleToGroupSchema } from './routes/group';

export type SignUpRequest = z.infer<typeof insertUserSchema>;

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type CreateGroupRequest = z.infer<typeof insertGroupSchema>;

export type CreateRoleRequest = z.infer<typeof insertRoleSchema>;

export type InsertRoleToGroupRequest = z.infer<typeof insertRoleToGroupSchema>;
