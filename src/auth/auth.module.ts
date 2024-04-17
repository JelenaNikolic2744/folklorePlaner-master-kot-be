import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [AuthController],
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get('SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        ConfigService,
        AuthService,
        JwtStrategy,
        {
            provide: 'USERS_SERVICE',
            useFactory: (configService: ConfigService) =>
                ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        port: configService.get('USERS_PORT'),
                    },
                }),
            inject: [ConfigService],
        },
    ],
    exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
