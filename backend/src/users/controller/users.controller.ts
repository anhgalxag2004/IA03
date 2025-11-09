import { Controller, Post, Body } from '@nestjs/common';

import { UsersService } from '../service/users.service';
import { RegisterDto } from '../dto/register.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.usersService.register(registerDto);
  }
}
