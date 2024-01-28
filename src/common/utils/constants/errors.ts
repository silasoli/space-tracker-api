import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

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
  },
  RENTALS: {
    NOT_FOUND: new NotFoundException({
      id: 'RENTALS-001',
      message: 'Agendamento não encontrado.',
    }),
    PREVIOUS_CHECKIN: new BadRequestException({
      id: 'RENTALS-002',
      message: 'A data de check-out não pode ser anterior à data de check-in.',
    }),
    ADVANCE_CHECKIN: new BadRequestException({
      id: 'RENTALS-003',
      message:
        'Só é possível realizar uma reserva com no mínimo 1 dia de antecedência.',
    }),
    RENTAL_LIMIT: new BadRequestException({
      id: 'RENTALS-004',
      message: 'Só é possível realizar uma reserva de no máximo 3 dias',
    }),
    RENTAL_CONFLICT: new ConflictException({
      id: 'RENTALS-005',
      message: 'Data não disponível',
    }),
  },
};
