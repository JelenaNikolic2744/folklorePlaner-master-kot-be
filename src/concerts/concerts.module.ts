import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConcertsController } from './concerts.controller';

@Module({
    imports: [ConfigModule],
    controllers: [ConcertsController],
    providers: [
        {
            provide: 'CONCERTS_SERVICE',
            useFactory: (configService: ConfigService) =>
                ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        port: configService.get('CONCERTS_PORT'),
                    },
                }),
            inject: [ConfigService],
        },
    ],
})
export class ConcertsModule {}
