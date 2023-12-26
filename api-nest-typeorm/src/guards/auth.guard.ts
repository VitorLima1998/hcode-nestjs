import { UserService } from '../user/user.service';
import { AuthService } from './../auth/auth.service';
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try {
            const token = (authorization ?? '').split(' ')[1];
            const data = this.authService.checkToken(token);

            request.tokenPayload = data;
            request.user = await this.userService.findOne(data.id);

            return true;
        } catch {
            return false;
        }
    }
}
