import { ForbiddenException, NotFoundException } from '@nestjs/common';

export const ERRORS = {
  USERS: {
    NOT_FOUND: new NotFoundException({
      id: 'USERS-001',
      message: 'Usuário não encontrado.',
    }),
  },
  AUTH: {
    INVALID_CREDENTIALS: new ForbiddenException({
      id: 'AUTH-001',
      message: 'Credenciais inválidas',
    }),
  }
};
