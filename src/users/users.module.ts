import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';

@Module({
    imports: [ConfigModule],
    controllers: [UsersController],
    providers: [
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
})
export class UsersModule {}
