import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { BcryptService } from '../security/bcrypt.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const { email, password } = registerDto;

    this.logger.log(`Attempting to register user: ${email}`);

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      this.logger.warn(`Registration failed: User ${email} already exists`);
      throw new ConflictException(`User [${email}] already exists`);
    }

    try {
      const user = new User();
      user.email = email;
      user.password = await this.bcryptService.hash(password);
      await this.userRepository.save(user);
      this.logger.log(`User ${email} successfully registered`);
    } catch (error) {
      this.logger.error(`Registration failed for ${email}: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
