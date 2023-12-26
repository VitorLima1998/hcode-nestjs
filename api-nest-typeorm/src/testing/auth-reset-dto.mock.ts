import { AuthResetDTO } from '../auth/dto/auth-reset.dto';
import { resetToken } from './reset-token.mock';

export const authResetDto: AuthResetDTO = {
    password: 'P@$$w0rd',
    token: resetToken,
};
