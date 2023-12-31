import { AuthGuard } from './../guards/auth.guard';
import { UserService } from './user.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { LogInterceptor } from '../interceptors/log.interceptor';
import { ParamId } from '../decorators/param-id.decorator';
import { RoleGuard } from '../guards/role.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }
    @Get()
    async read() {
        return this.userService.findAll();
    }

    @Get('/:id')
    async readOne(@ParamId() id: string) {
        return this.userService.findOne(id);
    }
    @Put('/:id')
    async update(@Body() data: UpdateUserDTO, @Param('id') id: string) {
        return this.userService.update(id, data);
    }
    @Patch('/:id')
    async updatePartial(
        @Body() data: UpdatePatchUserDTO,
        @Param('id') id: string,
    ) {
        return this.userService.updatePartial(id, data);
    }
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        return {
            success: await this.userService.delete(id),
        };
    }
}
