import { Request } from 'express';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.type';

export type RequestWithUser = Request & {
  user?: AuthenticatedUser;
};
