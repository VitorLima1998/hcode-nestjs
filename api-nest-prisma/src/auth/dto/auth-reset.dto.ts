import { IsJWT, IsString, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {
    @IsString()
    @IsStrongPassword()
    password: string;

    @IsJWT()
    token: string;
}
