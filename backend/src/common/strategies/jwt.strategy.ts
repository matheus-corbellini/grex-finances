import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    });
  }

  async validate(payload: any) {
    // Para desenvolvimento, vamos aceitar qualquer payload válido
    // Em produção, você deve validar o usuário no banco de dados
    const user = {
      id: payload.sub || payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    if (!user.id) {
      throw new UnauthorizedException('Token inválido');
    }

    return user;
  }
}
