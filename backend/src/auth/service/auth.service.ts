import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/service/users.service';
import { BcryptService } from '../../users/security/bcrypt.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  private refreshTokenStore: Set<string> = new Set();

  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.refreshSecret'),
      expiresIn: this.configService.get<number>(
        'app.jwt.refreshExpiresIn',
        604800,
      ),
    });

    this.refreshTokenStore.add(refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async refreshTokens(user: any) {
    const payload = { email: user.email, sub: user.sub };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.refreshSecret'),
      expiresIn: this.configService.get<number>(
        'app.jwt.refreshExpiresIn',
        604800,
      ),
    });

    this.refreshTokenStore.add(refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    // TODO: In a real application, you might want to blacklist tokens
    // For simplicity, we'll just return success
    return { message: 'Logged out successfully' };
  }

  validateRefreshToken(refreshToken: string): any {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
      });

      if (!this.refreshTokenStore.has(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
