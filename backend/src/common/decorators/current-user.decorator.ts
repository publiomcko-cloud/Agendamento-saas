import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.type';
import { RequestWithUser } from '../types/request-with-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user as AuthenticatedUser;
  },
);
