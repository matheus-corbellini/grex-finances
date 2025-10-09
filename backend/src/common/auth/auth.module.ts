import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../modules/users/users.module';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { FirebaseStrategy } from '../strategies/firebase.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
  ],
  providers: [JwtStrategy, FirebaseStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule { }
